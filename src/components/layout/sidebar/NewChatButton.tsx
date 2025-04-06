
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
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md transition-all hover:shadow-lg"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> New Chat
      </Button>
    </div>
  );
}
