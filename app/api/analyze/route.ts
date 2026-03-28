import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { company } = await req.json();

  if (!company) {
    return NextResponse.json({ error: "Company name required" }, { status: 400 });
  }

  const systemPrompt = `You are a senior legal research analyst. When given a company name, you research its legal history using web search and return a structured JSON object. Be factual, cite specific cases, settlements, and dates where possible. Never fabricate cases — only include verified information.

Return ONLY valid JSON with this exact structure, no markdown, no preamble:
{
  "company": "Official company name",
  "summary": "A 2-3 paragraph narrative legal biography written in a journalistic, engaging tone. Tell the story of the company's legal history like a seasoned reporter would. Mention specific cases, dollar amounts, outcomes.",
  "riskScore": <integer 0-100 where 0=no legal issues, 100=extremely high legal risk>,
  "riskRationale": "1-2 sentences explaining the risk score",
  "timeline": [
    {
      "year": <4-digit year as integer>,
      "title": "Short event title",
      "description": "1-2 sentence description of what happened",
      "category": <one of: "Fraud", "Employment", "Regulatory", "Environmental", "IP", "Consumer", "Antitrust", "Criminal", "Settlement", "Other">,
      "severity": <one of: "low", "medium", "high">
    }
  ],
  "categories": ["array of unique categories present in the timeline"],
  "verdict": "One punchy sentence — the bottom line on this company's legal reputation"
}

Sort timeline events chronologically, oldest first. Include only real, verifiable events.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: systemPrompt,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [
          {
            role: "user",
            content: `Research and analyze the complete legal history of: ${company}. Focus on major lawsuits, regulatory actions, settlements, fines, and criminal cases. Search for the most significant and well-documented legal events.`,
          },
        ],
      }),
    });

    const data = await response.json();

    // Extract text from all content blocks (handles tool use + text responses)
    const fullText = data.content
      .map((item: { type: string; text?: string }) =>
        item.type === "text" ? item.text : ""
      )
      .filter(Boolean)
      .join("\n");

    // Parse JSON from response
    const jsonMatch = fullText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Strip any citation tags from all text fields
    const stripCitations = (str: string) => str.replace(/]*>|<\/antml:cite>/g, "");
    parsed.summary = stripCitations(parsed.summary);
    parsed.verdict = stripCitations(parsed.verdict);
    parsed.riskRationale = stripCitations(parsed.riskRationale);
    parsed.timeline = parsed.timeline.map((e: any) => ({
      ...e,
      title: stripCitations(e.title),
      description: stripCitations(e.description),
    }));
    
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Failed to analyze company. Please try again." },
      { status: 500 }
    );
  }
}
