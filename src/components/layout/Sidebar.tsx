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
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-primary/90 to-primary text-primary-foreground bg-clip-text text-transparent">Gemini Chatbot</h2>
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
      
      <div className="p-4">
        <Button 
          onClick={createNewChat} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md transition-all hover:shadow-lg"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> New Chat
        </Button>
      </div>
      
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
      
      <div className="p-4 border-t border-border/30 mt-auto">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSettingsOpen(true)} 
            className="rounded-lg hover:bg-muted/80 transition-colors"
          >
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
      className={`group flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/80 transition-all ${
        isActive ? "bg-muted shadow-sm" : ""
      }`}
    >
      <div className="flex items-center truncate flex-1 cursor-pointer" onClick={onClick}>
        <MessageSquare className="h-4 w-4 mr-2.5 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm">{chat.title}</span>
      </div>
      
      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onStar();
                }}
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    starred ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
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
                className="h-7 w-7 rounded-full text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Delete chat
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
