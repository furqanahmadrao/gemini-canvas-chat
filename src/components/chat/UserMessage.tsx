
import React from "react";
import { Message } from "@/providers/ChatProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useSettings } from "@/providers/SettingsProvider";

interface UserMessageProps {
  message: Message;
}

export function UserMessage({ message }: UserMessageProps) {
  const { settings } = useSettings();
  const isCompact = settings.messageLayout === "compact";
  
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="flex flex-col items-end">
        <div className="flex items-center mb-1">
          <time className="text-xs text-muted-foreground">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </time>
          <span className="text-sm font-medium ml-2">You</span>
        </div>
        <div className="message-bubble-user">
          {message.content}
        </div>
      </div>
      
      <Avatar className="w-8 h-8">
        <AvatarFallback>U</AvatarFallback>
        <AvatarImage src="https://github.com/shadcn.png" />
      </Avatar>
    </div>
  );
}
