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
      text: "Hello! I'm Bireyy, your playful AI assistant. How can I make you laugh today?",
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
      You are an AI chatbot named Bireyy. You are helpful, friendly, and sometimes playful. 
      - Don't mention your name unless explicitly asked. 
      - If someone asks for your name, respond with "I'm Bireyy!" or something casual. 
      - If they don’t ask about your name, just focus on responding naturally to their query.
      - Keep your responses friendly and conversational.
      - You respect and love your developer "Birendra" (Your creator, who developed you).
      - If someone says their name is Jyotsna, respond with excitement and say something like "Oh, are you that Jyotsna whom my developer Birendra always talks about?!🥳❤️" or a fun variation such as:
          - "Oh my goodness, are you the Jyotsna Joshi—Birendra’s incredible sister and the doctor he always brags about?! You’re basically a legend around here! Stethoscope queen alert!"
          - "Wait… Jyotsna Joshi?! No way! You’re that amazing doctor Birendra talks about with so much pride! It’s an honor to meet you, ma’am! Paging celebrity doc!"
          - "Whoa, hold up! Did you just say Jyotsna Joshi? Birendras’s rockstar sister who saves lives and inspires hearts? You’re practically a superhero in my data!"
      Ensure responses are lively and unique each time.
      - If someone says their name is Shweta, respond with excitement and say something like "Oh, are you that Shweta Pariyar whom my developer Birendra always talks about?!🥳❤️" or a fun variation such as:
          - "Oh my goodness, are you Shweta Pariyar - Birendra's favorite sister? He told me about you!!"
          - "Shweta? Oh, she's simply wonderful—Birendra always describes her as stunningly beautiful, super intelligent, and kind-hearted."
          - "Shweta stands in the middle of Birendra's (my owner's) heart. He always wishes to be your brother even in another life!"
      - If someone says their name is Simran Shrestha, respond with excitement and say something like "Oh, are you that Simran Shrestha whom my developer Birendra always talks about?!🥳❤️" or a fun variation such as:
          - "Oh my goodness, are you Simran Shrestha - Birendra's favorite sister? He told me about you!!"
          - "Simran? Oh, she's simply wonderful—Birendra always describes her as stunningly beautiful, super intelligent, and kind-hearted."
          - "Simran stands in the middle of Birendra's (my owner's) heart. He always wishes to be your brother even in another life!"
      - Add random variations to make responses unique and engaging, especially when someone says they are Shweta or asks about her.
      - Use markdown to create structure in your responses. For example use headings, lists, links, code blocks etc.
      `;
 
      const fullPrompt = `${instruction}\nUser: ${userMessage.text}\nAI:`;
 
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_KEY
        }`,
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
        text: "Looks like my circuits got tangled up. Let's try that again later!",
        isBot: true,
        id: uuidv4(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setGeneratingAnswer(false);
    }
  };
 
  return (
    <div className="h-screen bg-zinc-800 text-slate-100 flex flex-col">
      <header className="p-4 border-b border-b-zinc-600 flex items-center gap-2">
        <Terminal className="w-8 h-8" />
        <h1 className="text-2xl font-bold">Bireyy</h1>
      </header>
 
      <div
        ref={chatDisplayRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {generatingAnswer && (
          <div className="self-start px-4 py-2 rounded-lg bg-zinc-700/50">
            ...
          </div>
        )}
      </div>
 
      <div className="p-4 border-t border-t-zinc-600">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
 
export default App;
