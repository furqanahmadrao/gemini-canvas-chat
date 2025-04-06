
import React from "react";
import { Button } from "@/components/ui/button";
import { XCircle, ChevronLeft } from "lucide-react";

interface SidebarHeaderProps {
  onClose?: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border/30">
      <h2 className="text-lg font-semibold bg-gradient-to-r from-primary/90 to-primary text-primary-foreground bg-clip-text text-transparent">
        Gemini Chatbot
      </h2>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="md:hidden rounded-full hover:bg-muted/80 transition-colors"
        >
          <XCircle className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="hidden md:flex rounded-full hover:bg-muted/80 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
