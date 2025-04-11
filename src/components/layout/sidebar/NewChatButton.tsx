
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles } from "lucide-react";

interface NewChatButtonProps {
  onClick: () => void;
}

export function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <div className="p-4">
      <Button 
        onClick={onClick} 
        className="w-full bg-gradient-to-r from-primary/80 to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground rounded-2xl shadow-lg transition-all hover:shadow-xl hover:translate-y-[-2px] h-11"
        title="Create a new chat"
        aria-label="Create a new chat"
      >
        <div className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="font-medium">New Chat</span>
          <Sparkles className="h-3.5 w-3.5 ml-1 text-yellow-300 animate-pulse" />
        </div>
      </Button>
    </div>
  );
}
