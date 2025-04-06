
import React from "react";
import { MessageSquare, Star, Trash2 } from "lucide-react";
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
  return (
    <div
      className={`group flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/80 transition-all ${
        isActive ? "bg-muted shadow-sm" : ""
      }`}
    >
      <div className="flex items-center truncate flex-1 cursor-pointer" onClick={onClick}>
        <MessageSquare className="h-4 w-4 mr-2.5 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm">{chat.title}</span>
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
