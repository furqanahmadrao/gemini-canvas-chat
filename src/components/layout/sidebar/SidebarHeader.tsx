
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarHeaderProps {
  onClose?: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  const { toggleSidebar } = useSidebar();

  const handleClick = () => {
    if (onClose) {
      onClose();
    }
    toggleSidebar();
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border/30">
      <h2 className="text-lg font-semibold bg-gradient-to-r from-primary/90 to-primary text-primary-foreground bg-clip-text text-transparent">
        Gemini Chatbot
      </h2>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleClick}
          className="rounded-full hover:bg-muted/80 transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
