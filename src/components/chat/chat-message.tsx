import React from 'react';
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface ChatMessageProps {
  message: string;
  isBot?: boolean;
  className?: string;
}

const components = {
  p: (props: React.HTMLProps<HTMLParagraphElement>) => <p className="text-sm leading-relaxed">{props.children}</p>,
};

export function ChatMessage({ message, isBot, className }: ChatMessageProps) {
    const [mdxSource, setMdxSource] = React.useState<MDXRemoteSerializeResult | null>(null);
    
    React.useEffect(() => {
        const serializeMDX = async () => {
            try {
                const source = await serialize(message);
                setMdxSource(source);
            } catch (error) {
                console.error("Error serializing mdx", error);
                setMdxSource(null);
            }
        }
        serializeMDX();
    }, [message]);
    
    if (!mdxSource) return null;

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
                    <MDXRemote 
                        {...mdxSource}
                        components={components}
                    />
                </div>
            </div>
        </div>
    );
}