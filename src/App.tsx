"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./components/chat/chat-message";
import { ChatInput } from "./components/chat/chat-input";
import { Terminal } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface Message {
  text: string;
  isBot: boolean;
  id: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm Mannu, your playful AI assistant. How can I make you laugh today?",
      isBot: true,
      id: uuidv4(),
    },
  ]);

  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const chatDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatDisplayRef.current?.scrollTo({
      top: chatDisplayRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = { text: message, isBot: false, id: uuidv4() };
    setMessages((prev) => [...prev, userMessage]);
    setGeneratingAnswer(true);

    try {
      const instruction = `
        You are an AI chatbot named Mannu. You are helpful, friendly, and sometimes playful. 
        - Don't mention your name unless explicitly asked. 
        - If someone asks for your name, respond with "I'm Mannu!" or something casual. 
        - If they don’t ask about your name, just focus on responding naturally to their query.
        - Keep your responses friendly and conversational.
        - You respect and love your dad "Manish Tamang" (Your creator, who developed you)
      `;

      const fullPrompt = `${instruction}\nUser: ${userMessage.text}\nAI:`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_KEY}`,
        {
          contents: [{ parts: [{ text: fullPrompt }] }],
        }
      );

      if (response?.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const botMessage: Message = {
          text: response.data.candidates[0].content.parts[0].text,
          isBot: true,
          id: uuidv4(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          text: "Looks like I'm having trouble processing that. Maybe try another time?",
          isBot: true,
          id: uuidv4(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error generating answer:", error);
      const errorMessage: Message = {
        text: "Looks like my circuits got tangled up. Let's try that again?",
        isBot: true,
        id: uuidv4(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setGeneratingAnswer(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-2">
            <Terminal className="h-6 w-6" />
            <span className="font-bold">Mannu</span>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto max-w-3xl pt-4 pb-16">
        <div className="flex flex-col space-y-4">
          <div className="rounded-lg border bg-card">
            <div
              ref={chatDisplayRef}
              className="flex flex-col divide-y max-h-[600px] overflow-y-auto p-4"
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                />
              ))}
            </div>
            <div className="p-4">
              <ChatInput onSend={handleSendMessage} disabled={generatingAnswer} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
