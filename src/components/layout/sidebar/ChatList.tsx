
import React from "react";
import { useChat } from "@/providers/ChatProvider";
import { ChatItem } from "./ChatItem";

export function ChatList() {
  const { filteredChats, currentChat, setCurrentChat, deleteChat, starChat } = useChat();

  return (
    <div className="flex flex-col space-y-1 overflow-auto">
      {filteredChats.length === 0 ? (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          No chats found
        </div>
      ) : (
        filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={currentChat?.id === chat.id}
            onClick={() => setCurrentChat(chat.id)}
            onDelete={() => deleteChat(chat.id)}
            onStar={(starred) => starChat(chat.id, starred)}
          />
        ))
      )}
    </div>
  );
}
