
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
      <Avatar className="w-10 h-10 ring-2 ring-primary/20">
        <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
        <AvatarImage src="https://api.dicebear.com/7.x/bottts/svg?seed=gemini&backgroundColor=6366f1" />
      </Avatar>
      
      <div className="flex flex-col">
        <div className="flex items-center mb-1">
          <span className="text-sm font-medium bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Gemini</span>
          <time className="text-xs text-muted-foreground ml-2">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </time>
        </div>
        
        <div className="message-bubble-ai shadow-md transition-all hover:shadow-lg">
          {isTyping ? (
            <div className="flex items-center space-x-2 py-2">
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
                    <div className="my-2 rounded-lg overflow-hidden shadow-lg">
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="!bg-gray-800 !rounded-lg"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-secondary/70 px-1.5 py-0.5 rounded-md font-mono text-sm" {...props}>
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
