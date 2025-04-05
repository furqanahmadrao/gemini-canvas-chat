
import React from "react";
import { useChat } from "@/providers/ChatProvider";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export function EmptyState() {
  const { createNewChat } = useChat();
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl font-semibold text-white">
          <span className="text-blue-400">Hello,</span>{" "}
          <span className="text-pink-400">User</span>
        </h2>
        <p className="text-gray-400 mt-6">
          How can I help you today?
        </p>
        <div className="pt-4">
          <Button
            onClick={createNewChat}
            variant="outline"
            className="border-gray-700 hover:bg-gray-800 text-gray-300"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
