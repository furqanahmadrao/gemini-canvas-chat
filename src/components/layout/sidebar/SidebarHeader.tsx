
import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SidebarHeaderProps {
  onClose?: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = () => {
    setSearchQuery("");
    setSearchVisible(false);
  };

  return (
    <div className="flex flex-col space-y-3 p-4 border-b border-border/30">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-primary/90 to-primary text-transparent bg-clip-text">
          Gemini Chatbot
        </h2>
        
        <button 
          onClick={() => setSearchVisible(!searchVisible)}
          className="rounded-full p-1.5 hover:bg-secondary/80 transition-colors hover-scale"
          title="Search chats"
          aria-label="Search chats"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
      
      {searchVisible && (
        <div className="transition-all animate-fade-in">
          <div className="relative">
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 text-sm bg-secondary/20 pl-9 pr-9 rounded-xl"
            />
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 rounded-full h-5 w-5 flex items-center justify-center bg-secondary/50 hover:bg-secondary"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
