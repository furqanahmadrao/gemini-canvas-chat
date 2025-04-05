
import React from "react";
import { useChat } from "@/providers/ChatProvider";
import {
  PlusCircle,
  MessageSquare,
  Star,
  Trash2,
  Settings,
  XCircle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SettingsModal } from "../modals/SettingsModal";
import { ThemeToggle } from "../ui/theme-toggle";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { chats, currentChat, createNewChat, deleteChat, setCurrentChat, starChat } = useChat();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
  const starredChats = sortedChats.filter(chat => chat.starred);
  const recentChats = sortedChats.filter(chat => !chat.starred);
  
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Gemini Chatbot</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="md:hidden"
          >
            <XCircle className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="hidden md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <Button 
          onClick={createNewChat} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 rounded-md">
        {starredChats.length > 0 && (
          <div className="px-4 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center">
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
        
        <div className="px-4 pb-2 mt-4">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center">
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
              <div className="text-sm text-muted-foreground p-2 rounded-md bg-secondary/50">
                No recent chats
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setSettingsOpen(true)} className="rounded-lg">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <ThemeToggle />
        </div>
      </div>
      
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

interface ChatItemProps {
  chat: {
    id: string;
    title: string;
    updatedAt: number;
  };
  isActive: boolean;
  onClick: () => void;
  onDelete: () => void;
  onStar: () => void;
  starred: boolean;
}

function ChatItem({ chat, isActive, onClick, onDelete, onStar, starred }: ChatItemProps) {
  return (
    <div
      className={`group flex items-center justify-between rounded-lg px-2 py-2 hover:bg-secondary ${
        isActive ? "bg-secondary" : ""
      }`}
    >
      <div className="flex items-center truncate flex-1 cursor-pointer" onClick={onClick}>
        <MessageSquare className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm">{chat.title}</span>
      </div>
      
      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onStar();
                }}
              >
                <Star
                  className={`h-4 w-4 ${
                    starred ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {starred ? "Remove star" : "Star chat"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Delete chat
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
