
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SidebarHeaderProps {
  onClose?: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col space-y-2 p-4 border-b border-border/30">
      <div className="flex items-center justify-end">
        <button 
          onClick={() => setSearchVisible(!searchVisible)}
          className="rounded-full p-1.5 hover:bg-secondary/80 transition-colors"
          title="Search chats"
          aria-label="Search chats"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
      
      {searchVisible && (
        <div className="transition-all animate-fade-in">
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-sm bg-secondary/50"
          />
        </div>
      )}
    </div>
  );
}
