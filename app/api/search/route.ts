import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";


const genAI = new GoogleGenAI({ apiKey: process.env.NESA_API_KEY });


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let prompt = 'I will give you a name Nesa. After colon there is query which you have to resolve or answer : ' + body.prompt;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    if(!result){
        throw new Error("Something went wrong");
    }

    const text = result.text;
    
    let cleanText = "";
        
    if(text){
        cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    }
    
    return NextResponse.json({
        success: true,
        data: cleanText
    },{status:200})
    
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: "Generation failed", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
