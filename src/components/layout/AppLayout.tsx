
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Chat } from "../chat/Chat";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiKeyModal } from "../modals/ApiKeyModal";
import { useSettings } from "@/providers/SettingsProvider";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { settings } = useSettings();

  // Check if the API key is set
  const isApiKeySet = !!settings.apiKey;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - dynamic visibility based on state */}
      <div
        className={`fixed inset-y-0 z-20 flex flex-col w-64 transform transition-transform duration-300 ease-in-out bg-card border-r border-border ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar with menu toggle */}
        <header className="flex items-center justify-between p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="text-lg font-medium ml-2 md:ml-0">Gemini Chatbot</div>
          <div className="flex items-center space-x-2">
            {/* This space can be used for additional header controls */}
          </div>
        </header>

        {/* Main chat area */}
        <main className="flex-1 overflow-hidden">
          <Chat />
        </main>

        {/* API key modal - only shown if API key is not set */}
        {!isApiKeySet && <ApiKeyModal />}
      </div>
    </div>
  );
}
