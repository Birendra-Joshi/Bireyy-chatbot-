import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
  className?: string;
}

export function ChatMessage({ message, isBot, className }: ChatMessageProps) {
  return (
    <div className={cn(
      "flex gap-3 p-4",
      isBot ? "bg-secondary/50" : "bg-background",
      className
    )}>
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
        {isBot ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">{isBot ? "Mannu" : "You"}</p>
        <div className="prose prose-neutral dark:prose-invert">
          <p className="text-sm leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}