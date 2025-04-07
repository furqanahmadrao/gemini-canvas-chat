
import React from "react";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarHeaderProps {
  onClose?: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border/30">
      <h2 className="text-lg font-semibold bg-gradient-to-r from-primary/90 to-primary text-primary-foreground bg-clip-text text-transparent">
        Gemini Chatbot
      </h2>
    </div>
  );
}
