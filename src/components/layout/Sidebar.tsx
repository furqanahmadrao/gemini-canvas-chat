
import React from "react";
import { useChat } from "@/providers/ChatProvider";
import {
  PlusCircle,
  MessageSquare,
  Star,
  Trash2,
  Settings,
  History,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { SettingsModal } from "../modals/SettingsModal";
import { ThemeToggle } from "../ui/theme-toggle";
import {
  Sidebar as SidebarBase,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar";

export function Sidebar() {
  const { chats, currentChat, createNewChat, deleteChat, setCurrentChat, starChat } = useChat();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const { state } = useSidebar();

  const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
  const starredChats = sortedChats.filter(chat => chat.starred);
  const recentChats = sortedChats.filter(chat => !chat.starred);
  
  return (
    <SidebarBase 
      side="left"
      collapsible="offcanvas"
      className="border-0 bg-[#1a1a1a] text-white"
    >
      <SidebarContent className="flex flex-col h-full p-0 bg-[#1a1a1a]">
        <div className="p-2 flex justify-center">
          <Button 
            onClick={createNewChat}
            size="icon"
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-gray-800 w-12 h-12 rounded-full"
          >
            <PlusCircle className="h-6 w-6" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 py-2">
            {starredChats.length > 0 && (
              <>
                {starredChats.map(chat => (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    isActive={currentChat?.id === chat.id}
                    onClick={() => setCurrentChat(chat.id)}
                    onDelete={() => deleteChat(chat.id)}
                    onStar={() => starChat(chat.id, false)}
                    starred={true}
                    compact={true}
                  />
                ))}
                <div className="h-px bg-gray-800 my-2" />
              </>
            )}
            
            {recentChats.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={currentChat?.id === chat.id}
                onClick={() => setCurrentChat(chat.id)}
                onDelete={() => deleteChat(chat.id)}
                onStar={() => starChat(chat.id, true)}
                starred={false}
                compact={true}
              />
            ))}
            {recentChats.length === 0 && starredChats.length === 0 && (
              <div className="text-sm text-gray-500 p-2 text-center">
                No chats yet
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="mt-auto space-y-1 p-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ThumbsUp className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ThumbsDown className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <History className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </SidebarContent>
      
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </SidebarBase>
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
  compact?: boolean;
}

function ChatItem({ chat, isActive, onClick, onDelete, onStar, starred, compact = false }: ChatItemProps) {
  return (
    <div
      className={`group flex items-center justify-between rounded-md px-2 py-2 hover:bg-gray-800 cursor-pointer ${
        isActive ? "bg-gray-800" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center truncate flex-1">
        <MessageSquare className="h-4 w-4 mr-2 shrink-0 text-gray-400" />
        {!compact && (
          <span className="truncate text-sm">{chat.title}</span>
        )}
      </div>
      
      {!compact && (
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
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
                  className="h-6 w-6 text-destructive"
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
      )}
    </div>
  );
}
