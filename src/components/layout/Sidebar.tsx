
import React from "react";
import { useChat } from "@/providers/ChatProvider";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { NewChatButton } from "./sidebar/NewChatButton";
import { ChatList } from "./sidebar/ChatList";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { SettingsModal } from "../modals/SettingsModal";

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { chats, currentChat, createNewChat, deleteChat, setCurrentChat, starChat } = useChat();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <>
      <SidebarHeader onClose={onClose} />
      
      <NewChatButton onClick={createNewChat} />
      
      <ChatList 
        chats={chats}
        currentChat={currentChat}
        setCurrentChat={setCurrentChat}
        deleteChat={deleteChat}
        starChat={starChat}
      />
      
      <SidebarFooter onSettingsClick={() => setSettingsOpen(true)} />
      
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
