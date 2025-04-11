
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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CustomInstructionsButton } from "../custom-instructions/CustomInstructionsButton";

// Fixed toggle button component that's always visible
const FixedToggleButton = () => {
  const { toggleSidebar, open } = useSidebar();
  const isMobile = useIsMobile();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="fixed left-0 top-2 z-50 bg-background/80 backdrop-blur-sm shadow-sm rounded-r-md rounded-l-none border-r border-y border-border transition-all hover:bg-secondary/80"
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      tabIndex={0}
      title={open ? "Collapse sidebar" : "Expand sidebar"}
    >
      {open ? 
        <ChevronLeft className="h-5 w-5 transition-transform" /> : 
        <ChevronRight className="h-5 w-5 transition-transform" />
      }
    </Button>
  );
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings } = useSettings();
  const { chats, currentChat, createNewChat, deleteChat, setCurrentChat, starChat } = useChat();
  const isMobile = useIsMobile();

  // Check if the API key is set
  const isApiKeySet = !!settings.apiKey;

  // Close sidebar by default on mobile
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <SidebarProvider defaultOpen={!isMobile} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex h-screen w-full bg-background">
        {/* Fixed toggle button that's always visible */}
        <FixedToggleButton />
        
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
          {/* Top bar with attractive "Mind Labs" title */}
          <header className="flex items-center justify-between p-4 border-b border-border">
            <div className="text-lg font-semibold ml-8 md:ml-8 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Mind Labs
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CustomInstructionsButton />
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
