
import React from "react";
import { MessageSquare, Star, Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Chat as ChatType } from "@/providers/ChatProvider";

type Chat = Pick<ChatType, "id" | "title" | "updatedAt" | "messages">;

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

  // Get first message preview (truncated)
  const getMessagePreview = () => {
    if (chat.messages && chat.messages.length > 0) {
      // Find first user message
      const userMessage = chat.messages.find(msg => msg.role === 'user');
      if (userMessage) {
        const preview = userMessage.content.substring(0, 30);
        return preview + (userMessage.content.length > 30 ? '...' : '');
      }
    }
    return "Empty chat";
  };

  return (
    <div
      className={`group flex flex-col rounded-xl px-3 py-2.5 hover:bg-secondary/70 transition-all shadow-sm hover:shadow-md ${
        isActive ? "bg-secondary neo-effect" : "bg-transparent"
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
      <div className="flex items-center justify-between cursor-pointer" onClick={onClick}>
        <div className="flex items-center truncate flex-1">
          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary mr-2.5 shrink-0">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div className="truncate flex-1">
            <div className="flex items-center gap-1">
              <span className="truncate text-sm font-medium">{chat.title}</span>
              {starred && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 ml-1" />}
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview of the message and timestamp */}
      <div className="pl-10 mt-1">
        <p className="text-xs text-muted-foreground truncate">{getMessagePreview()}</p>
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(chat.updatedAt)}
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
      </div>
    </div>
  );
}
