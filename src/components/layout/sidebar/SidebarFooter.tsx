
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface SidebarFooterProps {
  onSettingsClick: () => void;
}

export function SidebarFooter({ onSettingsClick }: SidebarFooterProps) {
  return (
    <div className="p-4 border-t border-border/30 mt-auto">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSettingsClick} 
          className="rounded-lg hover:bg-muted/80 transition-colors"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
