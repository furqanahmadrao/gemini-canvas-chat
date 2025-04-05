
import React from "react";
import { Message } from "@/providers/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useSettings } from "@/providers/SettingsProvider";

interface AIMessageProps {
  message: Message;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function AIMessage({ message }: AIMessageProps) {
  const { settings } = useSettings();
  const isCompact = settings.messageLayout === "compact";
  
  // If message is empty, show typing indicator
  const isTyping = message.content.trim() === "";
  
  return (
    <div className="flex items-start gap-3">
      <Avatar className="w-8 h-8">
        <AvatarFallback>AI</AvatarFallback>
        <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=gemini" />
      </Avatar>
      
      <div className="flex flex-col">
        <div className="flex items-center mb-1">
          <span className="text-sm font-medium">Gemini</span>
          <time className="text-xs text-muted-foreground ml-2">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </time>
        </div>
        
        <div className="message-bubble-ai">
          {isTyping ? (
            <div className="flex space-x-1">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          ) : (
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}: CodeProps) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-secondary/50 px-1 py-0.5 rounded" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
