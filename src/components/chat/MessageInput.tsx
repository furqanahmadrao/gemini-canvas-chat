
import React, { useState, useRef } from "react";
import { useChat } from "@/providers/ChatProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Mic } from "lucide-react";

export function MessageInput() {
  const { sendMessage, isLoading } = useChat();
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      sendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize the textarea
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="flex items-end gap-2 bg-card border border-border rounded-lg p-2">
      <Button variant="ghost" size="icon" className="shrink-0">
        <Paperclip className="h-5 w-5" />
      </Button>
      
      <Textarea
        ref={textareaRef}
        placeholder="Message Gemini..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        className="min-h-10 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={isLoading}
      />
      
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" className="shrink-0">
          <Mic className="h-5 w-5" />
        </Button>
        
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          className="shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
