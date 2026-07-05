import { SendHorizontal } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const nextHeight = Math.min(textarea.scrollHeight, 148);
    textarea.style.height = `${nextHeight}px`;
  }, [input]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-2 shadow-sm">
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Bireyy..."
          className="min-h-[48px] max-h-[148px] resize-none border-0 bg-transparent px-3 py-3 text-sm shadow-none focus-visible:ring-0"
          rows={1}
          disabled={disabled}
        />
        <Button
          onClick={handleSend}
          size="icon"
          className="h-[46px] w-[46px] shrink-0 rounded-2xl bg-blue-600 text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled || !input.trim()}
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <p className="px-2 pb-1 pt-2 text-xs text-slate-500">Press Enter to send • Shift + Enter for a new line</p>
    </div>
  );
}
