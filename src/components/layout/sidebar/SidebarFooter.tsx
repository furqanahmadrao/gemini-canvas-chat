
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, Info, Github } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarFooterProps {
  onSettingsClick: () => void;
}

export function SidebarFooter({ onSettingsClick }: SidebarFooterProps) {
  return (
    <div className="p-4 border-t border-border/30 mt-auto glass-effect bg-opacity-5 rounded-b-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onSettingsClick} 
                  className="rounded-lg hover:bg-muted/50 transition-all hover-scale h-9 w-9"
                  aria-label="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-lg hover:bg-muted/50 transition-all hover-scale h-9 w-9"
                  aria-label="About"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">About</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted/50 transition-all hover-scale"
                  aria-label="GitHub Repository"
                >
                  <Github className="h-4 w-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">GitHub Repository</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Enhanced theme toggle with glow effect */}
        <div className="hover-glow rounded-full">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
