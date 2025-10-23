import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { News } from "@/app/components/NEWS";

const genAI = new GoogleGenAI({ apiKey: process.env.NESA_API_KEY });


export async function GET() {
  try {
    const prompt = `Tell me 10 latest geopolitical or technology related news items of today in JSON format. 
    search news from source like bbc, the hindu, the economic times, times of india
Each news item should have this structure:
{
  "url": "string (give me url of that webpage which contains that news so i can read more)",
  "headline": "string (news headline)",
  "content": "string (brief news content)",
  "author": "string (author name)",
  "date": "string (ISO date format)"
}

Return ONLY a valid JSON array of 10 news objects, no markdown formatting.`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
    const text = result.text;

    let newsData: News[];
    let cleanText = "";
    
    if(text){
      cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    }
    newsData = JSON.parse(cleanText);
      
    if (!Array.isArray(newsData)) {
      throw new Error("Response is not an array");
    }

    return NextResponse.json({ news: newsData }, { status: 200 });
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: "Generation failed", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
