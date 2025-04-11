
import React from "react";
import { MessageSquare, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatItem } from "./ChatItem";
import { Chat as ChatType } from "@/providers/ChatProvider";

type Chat = ChatType;

interface ChatListProps {
  chats: Chat[];
  currentChat?: Chat | null;
  setCurrentChat: (id: string) => void;
  deleteChat: (id: string) => void;
  starChat: (id: string, starred: boolean) => void;
}

export function ChatList({ chats, currentChat, setCurrentChat, deleteChat, starChat }: ChatListProps) {
  const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
  const starredChats = sortedChats.filter(chat => chat.starred);
  const recentChats = sortedChats.filter(chat => !chat.starred);

  return (
    <ScrollArea className="flex-1 px-2">
      {starredChats.length > 0 && (
        <div className="px-2 pb-2">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center px-2 py-1">
            <Star className="mr-2 h-4 w-4" /> Starred Chats
          </h3>
          <div className="mt-2 space-y-1">
            {starredChats.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={currentChat?.id === chat.id}
                onClick={() => setCurrentChat(chat.id)}
                onDelete={() => deleteChat(chat.id)}
                onStar={() => starChat(chat.id, false)}
                starred={true}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="px-2 pb-2 mt-4">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center px-2 py-1">
          <MessageSquare className="mr-2 h-4 w-4" /> Recent Chats
        </h3>
        <div className="mt-2 space-y-1">
          {recentChats.map(chat => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={currentChat?.id === chat.id}
              onClick={() => setCurrentChat(chat.id)}
              onDelete={() => deleteChat(chat.id)}
              onStar={() => starChat(chat.id, true)}
              starred={false}
            />
          ))}
          {recentChats.length === 0 && (
            <div className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/30 text-center">
              No recent chats
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
