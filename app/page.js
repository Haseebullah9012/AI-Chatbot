"use client"

import { useState } from "react";

export default function Home() {
  
  const [prompt, setPrompt] = useState('');
  const [message, setMessage] = useState('');

  async function getResponseFromServerAPI(e) {
    e.preventDefault();
    setMessage('');
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({prompt:prompt}),
    });
    const body = await response.json();
    setMessage(body.message);
    setPrompt('');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16 bg-slate-800">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-center text-4xl">AI Chatbot</h1>

        <form>
          <input className="border-2 border-slate-900 bg-slate-700 text-slate-200 rounded-md px-2 py-1 m-2"
            type="text"
            value={prompt}
            onChange={(e)=>setPrompt(e.target.value)}
          />
          <button className="border-2 border-slate-950 bg-slate-900 px-2 py-1 mx-2 rounded-md text-slate-300" type="submit" onClick={getResponseFromServerAPI}>Get Response</button>
        </form>

        {message && (
          <div className="m-4 ">
            <pre>{message}</pre>
          </div>
        )}

      </div>
    </main>
  );
}
