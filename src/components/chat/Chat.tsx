
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "@/providers/ChatProvider";
import { useSettings } from "@/providers/SettingsProvider";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Loader2 } from "lucide-react";

export function Chat() {
  const { currentChat, isLoading } = useChat();
  const { settings } = useSettings();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    
    const scrollArea = scrollAreaRef.current;
    const { scrollTop, scrollHeight, clientHeight } = scrollArea;
    
    const isAtBottom = Math.abs((scrollTop + clientHeight) - scrollHeight) < 50;
    setShowScrollButton(!isAtBottom);
  };
  
  useEffect(() => {
    if (currentChat && !showScrollButton) {
      scrollToBottom();
    }
  }, [currentChat?.messages, showScrollButton]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.id]);

  useEffect(() => {
    const scrollAreaElement = scrollAreaRef.current;
    if (scrollAreaElement) {
      scrollAreaElement.addEventListener('scroll', handleScroll);
      return () => {
        scrollAreaElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  if (!currentChat) {
    return <EmptyState />;
  }

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat messages area with glassmorphism effect */}
      <div className="flex-1 rounded-2xl glass-effect m-2 overflow-hidden">
        <ScrollArea 
          ref={scrollAreaRef}
          className="h-full"
        >
          <div className={`p-6 pb-24 ${textSizeClasses[settings.textSize]}`}>
            <MessageList messages={currentChat.messages} />
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          className="absolute bottom-24 right-6 rounded-full shadow-lg hover-glow"
          size="icon"
          onClick={scrollToBottom}
          variant="secondary"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
      
      {/* Loading indicator with improved animation */}
      {isLoading && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 glass-effect py-2 px-5 rounded-full flex items-center space-x-2 shadow-lg">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm font-medium">Thinking...</span>
        </div>
      )}
      
      {/* Message input area */}
      <div className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent">
        <MessageInput />
      </div>
    </div>
  );
}
