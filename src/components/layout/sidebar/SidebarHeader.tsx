
import React, { useState } from "react";
import { Search, PenSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useChat } from "@/providers/ChatProvider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  onClose?: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { createNewChat, searchChats } = useChat();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchChats(query);
  };

  return (
    <div className="flex flex-col space-y-2 p-4 border-b border-border/30">
      <div className="flex items-center justify-end space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setSearchVisible(!searchVisible)}
                className="rounded-full p-1.5 hover:bg-secondary/80 transition-colors h-8 w-8"
                aria-label="Search chats"
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Search chats</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost"
                size="icon"
                onClick={createNewChat}
                className="rounded-full p-1.5 hover:bg-secondary/80 transition-colors h-8 w-8"
                aria-label="New chat"
              >
                <PenSquare className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">New chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {searchVisible && (
        <div className="transition-all animate-fade-in">
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={handleSearch}
            className="h-8 text-sm bg-secondary/50"
          />
        </div>
      )}
    </div>
  );
}
