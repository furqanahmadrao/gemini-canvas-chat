
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Chat } from "../chat/Chat";
import { Menu, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiKeyModal } from "../modals/ApiKeyModal";
import { useSettings } from "@/providers/SettingsProvider";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

function MainContent() {
  const { toggleSidebar } = useSidebar();
  const { settings } = useSettings();
  const isApiKeySet = !!settings.apiKey;

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-[#1a1a1a] text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-col ml-4">
            <div className="flex items-center">
              <span className="text-lg font-medium">Gemini</span>
              <Button variant="ghost" size="sm" className="ml-1 h-6 p-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </Button>
            </div>
            <span className="text-xs text-gray-400">2.0 Flash</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="rounded-full bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Try Gemini Advanced</span>
          </Button>
        </div>
      </header>

      {/* Main chat area */}
      <main className="flex-1 overflow-hidden">
        <Chat />
      </main>

      {/* API key modal - only shown if API key is not set */}
      {!isApiKeySet && <ApiKeyModal />}
    </div>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <MainContent />
      </div>
    </SidebarProvider>
  );
}
