import {NextResponse} from 'next/server';
//const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const data = await req.json(); //User Prompt
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({ history: data.chatHistory });
  let result = await chat.sendMessage(data.prompt);
  
  return NextResponse.json({response:result.response.text() });
}
