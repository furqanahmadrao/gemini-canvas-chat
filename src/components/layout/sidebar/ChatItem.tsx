
import React from "react";
import { MessageSquare, Star, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Chat as ChatType } from "@/providers/ChatProvider";

type Chat = Pick<ChatType, "id" | "title" | "updatedAt">;

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onStar: () => void;
  starred: boolean;
}

export function ChatItem({ chat, isActive, onClick, onDelete, onStar, starred }: ChatItemProps) {
  // Format the date: if today show time, else show date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div
      className={`group flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-secondary/80 transition-all ${
        isActive ? "bg-secondary shadow-sm" : ""
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-pressed={isActive}
    >
      <div className="flex items-center truncate flex-1 cursor-pointer" onClick={onClick}>
        <MessageSquare className="h-4 w-4 mr-2.5 shrink-0 text-muted-foreground" />
        <div className="truncate">
          <span className="truncate text-sm">{chat.title}</span>
          <div className="text-xs text-muted-foreground flex items-center mt-0.5">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(chat.updatedAt)}
          </div>
        </div>
      </div>
      
      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onStar();
                }}
                aria-label={starred ? "Remove from starred" : "Add to starred"}
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    starred ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {starred ? "Remove star" : "Star chat"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                aria-label="Delete chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Delete chat
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
