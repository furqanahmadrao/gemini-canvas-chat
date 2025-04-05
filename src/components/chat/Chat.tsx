
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

  const handleScrollPositionChange = (position: { y: number }) => {
    // Calculate the scroll height, visible area height, and scroll position
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const { scrollHeight, clientHeight } = scrollArea;
    const { y } = position;
    
    // Show scroll button when not at the bottom
    const isAtBottom = Math.abs(y - (scrollHeight - clientHeight)) < 50;
    setShowScrollButton(!isAtBottom);
  };
  
  // Auto scroll to bottom when a new message is added
  useEffect(() => {
    if (currentChat && !showScrollButton) {
      scrollToBottom();
    }
  }, [currentChat?.messages, showScrollButton]);

  // Always scroll to bottom when chat changes
  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.id]);

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
      {/* Chat messages area */}
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1" 
        onScrollPositionChange={handleScrollPositionChange}
      >
        <div className={`p-4 pb-24 ${textSizeClasses[settings.textSize]}`}>
          <MessageList messages={currentChat.messages} />
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          className="absolute bottom-24 right-4 rounded-full"
          size="icon"
          onClick={scrollToBottom}
          variant="secondary"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 bg-accent/80 py-1 px-4 rounded-full flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Thinking...</span>
        </div>
      )}
      
      {/* Message input area */}
      <div className="p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent">
        <MessageInput />
      </div>
    </div>
  );
}
