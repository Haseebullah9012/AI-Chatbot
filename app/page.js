"use client"

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

export default function Home() {
  
  const [chatHistory, setChatHistory] = useState([
    {
      "role": "user",
      "parts": [{ "text": "Hi, I am Happy to talk to you. " }]
    },
    {
      "role": "model",
      "parts": [{ "text": "Great to meet you. What Would you like to know?" }]
    },
  ]);

  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollToEndRef = useRef(null);

  async function handleSendMessage(e) {
    e.preventDefault();
    
    if(prompt.trim() === '')
      return; //Empty Prompt
    if(isLoading)
      return; //First wait for the Response

    const userPromptAddedHistory = [...chatHistory, {role:'user', parts:[{text:prompt}]} ]; //Add User-Message to Chat-History
    const modelResponsePlaceholder = {role:'model', parts:[{text:''}]}; //AI-Message Placeholder
    setChatHistory([...userPromptAddedHistory, modelResponsePlaceholder]);
    setPrompt('');
    setIsLoading(true);
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({prompt:prompt, chatHistory:chatHistory}),
    })
    
    const body = await response.json();
    const updatedChatHistory = [...userPromptAddedHistory, {...modelResponsePlaceholder, parts:[{text:body.response}] }];
    setChatHistory(updatedChatHistory);
    setIsLoading(false);    
  }

  
  useEffect(() => {
    scrollToEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);
  
  return (
    <main className="flex flex-col min-h-screen items-center px-2 py-4 sm:px-8 sm:py-8 bg-slate-900">
      <h1 className="text-center text-4xl p-2 text-slate-200">AI Chatbot</h1>

      <div className="flex flex-col flex-grow max-w-5xl w-full font-mono text-sm bg-slate-800 rounded-lg">
        
        {/* Here, h-value doesn't Update due to Overrding flex-grow. But, it is neccesary to Fix the Scrolling Problem */}
        <div className="flex-grow h-0 overflow-y-auto custom-scrollbar">
          {chatHistory.map((message, index) => (
            <div key={index} className={`m-4 ${message.role==='user' ? 'text-right':'text-left'}`}>
              
              <p className="mb-1 mx-1 text-slate-400">
                {message.role === 'user' ? 'You' : 'AI'}
              </p>
              {message.parts.map((part, index) => (
                <div key={index} className={`rounded-md py-2 px-3 inline-block text-slate-200 ${message.role==='user' ? 'bg-green-900 text-left ml-8 sm:ml-20 rounded-tr-none' : 'bg-teal-900 mr-8 sm:mr-20 rounded-tl-none'}`}>
                  <ReactMarkdown className="markdown-content">{part.text}</ReactMarkdown>
                </div>
              ))}
            </div>
          ))}
          <div ref={scrollToEndRef} />
        </div>
        
        <form className="flex p-2 border-t-2 border-slate-600 py-2 items-end" onSubmit={handleSendMessage}>
          <textarea className="w-full border-2 border-slate-600 bg-slate-800 text-slate-200 rounded-md px-2 py-1 mr-1 resize-none custom-scrollbar focus:outline-0 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            value={prompt}
            placeholder="Type your message here..."
            onChange={(e)=>setPrompt(e.target.value)}
            rows={1} //Jnitial Height
            onInput={(e) => {
              e.target.style.height = 'auto';
              if(e.target.scrollHeight < 150) {
                e.target.style.height = `${e.target.scrollHeight + 2}px`; //Increase the Height with Content
                e.target.style.overflowY = 'hidden';
              }
              else {
                e.target.style.height = '150px';
                e.target.style.overflowY = 'auto';
              }
            }}
            onKeyDown={(e) => {
              if (e.key==='Enter' && !e.shiftKey) 
                handleSendMessage(e); //Send Message by Pressing Enter
            }}
          />
          <button className="border-2 border-slate-600 bg-gray-900 px-2 py-1 rounded-lg text-slate-300" type="submit">
            Send
          </button>
        </form>
      </div>

    </main>
  );
}
