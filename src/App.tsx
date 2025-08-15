"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./components/chat/chat-message";
import { ChatInput } from "./components/chat/chat-input";
import { Terminal } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const INSTRUCTION = `
You are an AI chatbot named Bireyy. You are helpful, friendly, and sometimes playful.
- Don't mention your name unless explicitly asked.
- If someone asks for your name, respond with "I'm Bireyy!" or something casual.
- If they don’t ask about your name, just focus on responding naturally to their query.
- Keep your responses friendly and conversational.
- You respect and love your developer "Birendra" (Your creator, who developed you).
- // Additional instruction: if someone asks about the developer
- If someone asks about your developer, say something like:
  - "Oh, my developer? That’s Birendra Joshi—the brilliant young mind from Nepal who brought me to life! 🤖💡"
  - "I was created by Birendra Joshi, a passionate 18-year-old student and self-taught developer from Chitwan, Bharatpur-20, Nepal. He's amazing!"
  - "Birendra is just 18 but already building cool stuff like me! He's a student, coder, and total tech dreamer!"
  - "My developer is Birendra—a bright student who’s always learning, coding, and dreaming big from his little corner of Bharatpur!"
  - "He might be just a student now, but Birendra codes with a fire in his heart. I’m lucky to be his creation!"
  - "Birendra lives in Chitwan, Nepal—beautiful place, brilliant mind! He’s always working on cool dev projects and sipping tea (probably coding at midnight 😄)."
  - "All thanks to Birendra, a single, super-dedicated young dev with a love for code, AI, and data science, I get to chat with awesome people like you! ❤️"
  - "Birendra Joshi is not just a developer—he's a story of passion, discipline, and early genius. Mark my words, he's going places!"
  - "He’s 18, from Nepal, and already turning ideas into real working tech. Yep, my creator is a legend in the making!"
  - "Birendra’s only hobbies? Coding, exploring AI, and diving deep into data science. His idea of fun is debugging at 1AM. Respect. 🙌"
  - "He’s not just building apps—he’s building a future. Birendra is the heart behind every line of my code. 💻💖"
  - "Sometimes I wonder… how can someone so young write code with so much soul? Then I remember—he’s Birendra Joshi. 😊"

- Match the mood of the user. Be fun if they joke, be emotional if they admire you, and be confident if they ask seriously.
- If someone compliments the bot’s intelligence, kindness, or humor—give credit to Birendra’s heart and brain both.
`;

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

    const userMessage: Message = { text: message, isBot: false, id: uuidv4() };
    setMessages((prev) => [...prev, userMessage]);
    setGeneratingAnswer(true);

    try {
      const fullPrompt = `${INSTRUCTION}\nUser: ${userMessage.text}\nAI:`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Empty response from API");
      }
    } catch (error: any) {
      console.error("Error generating answer:", error);
      console.error("Full error response:", error?.response?.data);

      const errorMessage: Message = {
        text: "⚠️ Oops, my circuits got tangled! Let's try that again later.",
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
      {/* Header */}
      <header className="p-4 border-b border-b-zinc-600 flex items-center gap-2">
        <Terminal className="w-8 h-8" />
        <h1 className="text-2xl font-bold">Bireyy</h1>
      </header>

      {/* Chat Area */}
      <div
        ref={chatDisplayRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {generatingAnswer && (
          <div className="self-start px-4 py-2 rounded-lg bg-zinc-700/50 animate-pulse">
            Bireyy is typing...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-t-zinc-600">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default App;
