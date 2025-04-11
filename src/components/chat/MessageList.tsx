
import React from "react";
import { Message } from "@/providers/ChatProvider";
import { UserMessage } from "./UserMessage";
import { AIMessage } from "./AIMessage";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div key={message.id} className="animate-slide-in">
          {message.role === "user" ? (
            <UserMessage message={message} />
          ) : (
            <AIMessage message={message} />
          )}
        </div>
      ))}
    </div>
  );
}
