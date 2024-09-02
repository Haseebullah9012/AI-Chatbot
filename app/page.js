"use client"

import { useState } from "react";

export default function Home() {
  
  const [chatHistory, setChatHistory] = useState([
    {
      "role": "user",
      "parts": [{ "text": "Hi," }]
    },
    {
      "role": "model",
      "parts": [{ "text": "Great to meet you. What Would you like to know?" }]
    },
  ]);

  const [prompt, setPrompt] = useState('');
  
  async function getResponseFromServerAPI(e) {
    e.preventDefault();
    
    const updatedChatHistory = [...chatHistory, {role:'user', parts:[{text:prompt}]} ]; //Add User-Message to Chat-History
    setChatHistory(updatedChatHistory);
    setPrompt('');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({prompt:prompt, chatHistory:chatHistory}),
    });

    const body = await response.json();
    setChatHistory([...updatedChatHistory, {role:'model', parts:[{text:body.response}]} ]); //Add AI-Message to Chat-History
  }
  
  return (
    <main className="flex flex-col min-h-screen items-center px-2 py-4 sm:px-8 sm:py-8 bg-slate-800">
      <h1 className="text-center text-4xl p-2 text-slate-200">AI Chatbot</h1>

      <div className="flex flex-col flex-grow max-w-5xl w-full font-mono text-sm bg-slate-900 rounded-lg">
        
        {/* Here, h-value doesn't Update due to Overrding flex-grow. But, it is neccesary to Fix the Scrolling Problem */}
        <div className="flex-grow h-0 overflow-y-auto custom-scrollbar">
          {chatHistory.map((message, index) => (
            <div key={index} className={`m-4 ${message.role==='user' ? 'text-right':'text-left'}`}>
              
              <p className="pb-1 px-1">
                {message.role === 'user' ? 'You' : 'AI'}
              </p>
              {message.parts.map((part, index) => (
                <p key={index} className={`rounded-md p-2 inline-block ${message.role==='user' ? 'bg-green-900 text-left ml-8 sm:ml-20 rounded-tr-none' : 'bg-blue-900 mr-8 sm:mr-20 rounded-tl-none'}`}>
                  {part.text}
                </p>
              ))}
            </div>
          ))}
        </div>
        
        <form className="flex bg-slate-900 p-2 border-t-2 border-slate-600 py-2 items-end">
          <textarea className="w-full border-2 border-slate-700 bg-slate-800 text-slate-200 rounded-md px-2 py-1 mr-1 resize-none custom-scrollbar focus:outline-0 focus:ring-1 focus:ring-slate-500"
            value={prompt}
            onChange={(e)=>setPrompt(e.target.value)}
            onInput={(e) => {
              e.target.style.height = 'auto';
              if(e.target.scrollHeight < 150) {
                e.target.style.height = `${e.target.scrollHeight}px`; //Increase the Height with Content
                e.target.style.overflowY = 'hidden';
              }
              else {
                e.target.style.height = '150px';
                e.target.style.overflowY = 'auto';
              }
            }}
            rows={1} //Jnitial Height
          />
          <button className=" border-2 border-slate-700 bg-slate-800 px-2 py-1 rounded-lg text-slate-300" type="submit" onClick={getResponseFromServerAPI}>Send</button>
        </form>
      </div>

    </main>
  );
}
