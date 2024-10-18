"use client";

import { useEffect, useState } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import MarkdownRenderer from "./_components/MarkDownRenderer";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<historyType>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleRun = async () => {
    setIsLoading(true);
    const response = await run(prompt);
    setIsLoading(false);

    if (prompt && response) {
      const _history = [...history, { prompt, response }];
      setHistory(_history);
      localStorage.setItem("history", JSON.stringify(_history));
    }

    setPrompt("");
  };

  useEffect(() => {
    const localHistory = localStorage.getItem("history");
    if (localHistory) {
      setHistory(JSON.parse(localHistory));
    } else {
      localStorage.setItem("history", JSON.stringify([]));
    }
    setIsLoading(false);
  }, []);

  return (
    <main className="max-w-3xl mx-auto">
      <h2>Ask me..</h2>

      <div className="mb-40">
        {history.map((hist, index) => (
          <div key={index}>
            <div className="flex justify-end py-3 text-red-400">
              <h3 className="underline italic">Q: {hist?.prompt}</h3>
            </div>
            <MarkdownRenderer content={hist?.response} />
          </div>
        ))}
      </div>
      <form className="fixed bottom-0 left-0 w-full bg-slate-950 flex items-center gap-2 px-4">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex-1">
            <textarea
              className="border w-full bg-slate-950 text-slate-50 placeholder:text-slate-200 rounded-xl p-2"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              rows={3}
            />
          </div>
          <div className="bg-indigo-500 rounded-xl">
            {isLoading ? (
              <div className="flex justify-center items-center p-2 gap-2 border border-slate-400 rounded-xl">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>

                <span>Processing...</span>
              </div>
            ) : (
              <button
                className="w-full border border-slate-400 p-2 rounded-xl"
                onClick={handleRun}
              >
                Ask me!
              </button>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}

type historyType = {
  prompt: string;
  response: string;
}[];
