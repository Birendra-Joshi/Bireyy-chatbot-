import { cn } from "@/lib/utils";
import { Bot, Copy, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
  timestamp?: string;
  className?: string;
}

export function ChatMessage({ message, isBot, timestamp, className }: ChatMessageProps) {
  const handleCopy = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(message);
    }
  };

  return (
    <div className={cn("flex w-full transition-all duration-300", isBot ? "justify-start" : "justify-end", className)}>
      <div className={cn("group flex max-w-[85%] gap-3", isBot ? "items-start" : "flex-row-reverse items-start")}>
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm",
            isBot ? "border-slate-200 bg-white text-slate-700" : "border-blue-200 bg-blue-600 text-white"
          )}
        >
          {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>

        <div
          className={cn(
            "rounded-2xl border px-4 py-3 shadow-sm transition duration-200",
            isBot
              ? "border-slate-200 bg-white text-slate-700"
              : "border-blue-100 bg-blue-600 text-white"
          )}
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className={cn("text-xs font-semibold uppercase tracking-[0.2em]", isBot ? "text-slate-500" : "text-blue-100")}>
              {isBot ? "Bireyy" : "You"}
            </p>
            {timestamp ? <p className={cn("text-[11px]", isBot ? "text-slate-400" : "text-blue-100/80")}>{timestamp}</p> : null}
          </div>
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message}</p>
          {!isBot ? (
            <button
              type="button"
              onClick={handleCopy}
              className="mt-2 flex items-center gap-1 rounded-full border border-white/20 px-2 py-1 text-[11px] text-blue-100 opacity-0 transition duration-200 group-hover:opacity-100"
              aria-label="Copy message"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
