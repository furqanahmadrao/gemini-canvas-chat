
import React from "react";
import { useChat } from "@/providers/ChatProvider";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function EmptyState() {
  const { createNewChat } = useChat();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold mb-2">Welcome to Gemini Chat</h2>
        <p className="text-muted-foreground mb-6">
          This is a client-side chat application that uses the Gemini API. 
          Your conversations stay on your device.
        </p>
        
        <Button onClick={createNewChat} className="mb-8">
          <PlusCircle className="mr-2 h-5 w-5" />
          Start a new chat
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border rounded-lg p-4 text-left">
            <h3 className="font-medium mb-1">Examples</h3>
            <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
            <ul className="text-sm space-y-2">
              <li>"Write a short story about a robot learning to paint"</li>
              <li>"What's the difference between machine learning and deep learning?"</li>
              <li>"How do I make a web application with React?"</li>
            </ul>
          </div>
          
          <div className="border border-border rounded-lg p-4 text-left">
            <h3 className="font-medium mb-1">Capabilities</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>Remembers previous messages in the conversation</li>
              <li>Allows you to provide follow-up corrections</li>
              <li>Supports code syntax highlighting</li>
              <li>Handles image input (coming soon)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
