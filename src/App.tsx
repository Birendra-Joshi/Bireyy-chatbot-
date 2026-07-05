"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageSquareText, Plus, Search, Settings, Sparkles, UserRound } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatInput } from "./components/chat/ChatInput";
import { ChatMessage } from "./components/chat/ChatMessage";

const INSTRUCTION = `
You are an AI chatbot named Bireyy. You are helpful, friendly, and sometimes playful.
- Don't mention your name unless explicitly asked.
- If someone asks for your name, respond with "I'm Bireyy!" or something casual.
- If they don’t ask about your name, just focus on responding naturally to their query.
- Keep your responses friendly and conversational.
- You respect and love your developer "Birendra" (Your creator, who developed you).
- If someone asks about your developer, say something like:
  - "Oh, my developer? That’s Birendra Joshi—the brilliant young mind from Nepal who brought me to life! 🤖💡"
`;

interface Message {
  text: string;
  isBot: boolean;
  id: string;
  timestamp: string;
}

const chatHistory = [
    { id: "1", title: "Product ideas", preview: "Help me frame a better launch plan" },
    { id: "2", title: "Writing help", preview: "Polish a short introduction" },
    { id: "3", title: "Quick notes", preview: "Summarize this in simple terms" },
  ];
function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! How can I make your day better today?",
      isBot: true,
      id: uuidv4(),
      timestamp: formatTime(new Date()),
    },
  ]);

  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const chatDisplayRef = useRef<HTMLDivElement>(null);
  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const scrollToBottom = () => {
      chatDisplayRef.current?.scrollTo({
        top: chatDisplayRef.current.scrollHeight,
        behavior: "smooth",
      });
    };
    setTimeout(scrollToBottom, 100);
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      text: message,
      isBot: false,
      id: uuidv4(),
      timestamp: formatTime(new Date()),
    };
    setMessages((prev) => [...prev, userMessage]);
    setGeneratingAnswer(true);

    try {
      const fullPrompt = `${INSTRUCTION}\nUser: ${userMessage.text}\nAI:`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: fullPrompt }] }],
        }
      );

      const botReply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (botReply) {
        const botMessage: Message = {
          text: botReply,
          isBot: true,
          id: uuidv4(),
          timestamp: formatTime(new Date()),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Empty response from API");
      }
    } catch (error: unknown) {
      console.error("Error generating answer:", error);
      let errorText = "⚠️ Oops, my circuits got tangled! Let's try that again later.";
      if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
        errorText = `API Error: ${error.response.data.error.message}`;
      } else if (error instanceof Error && error.message) {
        errorText = `Error: ${error.message}`;
      }
      const errorMessage: Message = {
        text: errorText,
        isBot: true,
        id: uuidv4(),
        timestamp: formatTime(new Date()),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setGeneratingAnswer(false);
    }
  };

  const filteredHistory = chatHistory.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="w-full border-b border-slate-200 bg-white p-4 lg:w-80 lg:border-b-0 lg:border-r lg:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">Bireyy</p>
                <p className="text-sm text-slate-500">AI assistant</p>
              </div>
            </div>
            <button type="button" className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50">
              <Settings className="h-4 w-4" />
            </button>
          </div>

          <Button className="mt-5 w-full justify-center rounded-2xl bg-blue-600 text-white transition duration-200 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New chat
          </Button>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search chats"
                className="h-10 rounded-xl border-0 bg-white pl-9 shadow-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {filteredHistory.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`flex w-full items-start rounded-2xl border px-3 py-3 text-left transition duration-200 ${
                  item.id === "1"
                    ? "border-blue-200 bg-blue-50 shadow-sm"
                    : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <MessageSquareText className="mt-0.5 mr-3 h-4 w-4 shrink-0 text-slate-500" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-800">{item.title}</span>
                  <span className="mt-1 block truncate text-xs text-slate-500">{item.preview}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">You</p>
              <p className="text-xs text-slate-500">Ready to chat</p>
            </div>
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col bg-white">
          <header className="border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">Current chat</p>
                <h1 className="text-xl font-semibold text-slate-900">Bireyy</h1>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50">
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <div ref={chatDisplayRef} className="flex-1 overflow-y-auto bg-white px-4 py-5 sm:px-6 sm:py-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-3">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                  timestamp={message.timestamp}
                />
              ))}

              {generatingAnswer && (
                <div className="flex max-w-[80%] items-center gap-2 self-start rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />
                  Bireyy is thinking...
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6 sm:py-4">
            <div className="mx-auto max-w-3xl">
              <ChatInput onSend={handleSendMessage} disabled={generatingAnswer} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
