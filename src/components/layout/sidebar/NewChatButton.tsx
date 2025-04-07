
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface NewChatButtonProps {
  onClick: () => void;
}

export function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <div className="p-4">
      <Button 
        onClick={onClick} 
        className="w-full bg-gradient-to-r from-primary/80 to-primary hover:from-primary/90 hover:to-primary/90 text-primary-foreground rounded-full shadow-sm transition-all hover:shadow-md"
        title="Create a new chat"
        aria-label="Create a new chat"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> New Chat
      </Button>
    </div>
  );
}
