import {NextResponse} from 'next/server';

export async function POST(req) {
  const data = await req.json(); //User Prompt
  
  let responses =  [
    "Ok. But why are you Asking...",
    "I'm pretty sure I'm not what you are thinking",
    "Is this a new trend?",
    "I'm happy to help. What can I do for you?",
    "That's great. Let's discuss it.",
    "I'm interested in learning more. Please continue.",
    "I don't have time for this."
  ]
  
  let i = Math.floor(Math.random() * responses.length);

  return NextResponse.json({message: '"' + data.prompt + '"\n\n' + responses[i]});
}