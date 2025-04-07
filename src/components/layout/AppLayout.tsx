
import React, { useState } from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { Chat } from "../chat/Chat";
import { ApiKeyModal } from "../modals/ApiKeyModal";
import { useSettings } from "@/providers/SettingsProvider";
import { SidebarHeader } from "./sidebar/SidebarHeader";
import { NewChatButton } from "./sidebar/NewChatButton";
import { ChatList } from "./sidebar/ChatList";
import { SidebarFooter } from "./sidebar/SidebarFooter";
import { SettingsModal } from "../modals/SettingsModal";
import { useChat } from "@/providers/ChatProvider";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings } = useSettings();
  const { chats, currentChat, createNewChat, deleteChat, setCurrentChat, starChat } = useChat();

  // Check if the API key is set
  const isApiKeySet = !!settings.apiKey;

  return (
    <SidebarProvider defaultOpen={true} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-screen w-full bg-background">
        {/* Sidebar - using shadcn/ui sidebar component */}
        <Sidebar>
          <SidebarContent>
            <SidebarHeader />
            <NewChatButton onClick={createNewChat} />
            <ChatList 
              chats={chats}
              currentChat={currentChat}
              setCurrentChat={setCurrentChat}
              deleteChat={deleteChat}
              starChat={starChat}
            />
            <SidebarFooter onSettingsClick={() => setSettingsOpen(true)} />
          </SidebarContent>
        </Sidebar>

        {/* Main content */}
        <SidebarInset>
          {/* Top bar - without any toggle button */}
          <header className="flex items-center justify-between p-4 border-b border-border">
            <div className="text-lg font-medium ml-2 md:ml-0">Gemini Chatbot</div>
            <div className="flex items-center space-x-2">
              {/* This space can be used for additional header controls */}
            </div>
          </header>

          {/* Main chat area */}
          <main className="flex-1 overflow-hidden">
            <Chat />
          </main>
        </SidebarInset>

        {/* API key modal - only shown if API key is not set */}
        {!isApiKeySet && <ApiKeyModal />}
        <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </SidebarProvider>
  );
}
