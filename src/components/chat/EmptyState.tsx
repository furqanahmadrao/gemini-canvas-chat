
import React from "react";
import { useChat } from "@/providers/ChatProvider";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, MessageSquare, Code, Brain, Image } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState() {
  const { createNewChat } = useChat();

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-center max-w-lg">
        <div className="mb-6 flex flex-col items-center">
          <div className="h-20 w-20 rounded-full glass-effect flex items-center justify-center mb-4">
            <Brain className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Welcome to Gemini Chat
          </h1>
          <p className="text-muted-foreground mb-6">
            Ask anything or explore Gemini's capabilities. Your conversations stay on your device.
          </p>
        </div>
        
        <Button 
          onClick={createNewChat} 
          className="mb-10 bg-gradient-to-r from-primary/80 to-primary hover:from-primary hover:to-primary/90 rounded-xl h-11 hover-scale shadow-lg"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Start a new chat
          <Sparkles className="ml-2 h-4 w-4 text-yellow-300" />
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="neo-effect border-none shadow-lg hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-lg">Examples</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
              <ul className="space-y-3 text-sm">
                <li className="p-2 bg-secondary/40 rounded-lg">
                  "Write a short story about a robot learning to paint"
                </li>
                <li className="p-2 bg-secondary/40 rounded-lg">
                  "What's the difference between machine learning and deep learning?"
                </li>
                <li className="p-2 bg-secondary/40 rounded-lg">
                  "How do I make a web application with React?"
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="neo-effect border-none shadow-lg hover-scale">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <CardTitle className="text-lg">Capabilities</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center p-2 bg-secondary/40 rounded-lg">
                  <MessageSquare className="h-4 w-4 mr-2 text-primary/70" />
                  <span>Remembers previous messages in conversation</span>
                </li>
                <li className="flex items-center p-2 bg-secondary/40 rounded-lg">
                  <Code className="h-4 w-4 mr-2 text-primary/70" />
                  <span>Supports code syntax highlighting</span>
                </li>
                <li className="flex items-center p-2 bg-secondary/40 rounded-lg">
                  <Image className="h-4 w-4 mr-2 text-primary/70" />
                  <span>Handles image input (coming soon)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
