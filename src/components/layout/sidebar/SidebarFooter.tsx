
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
    <div className="p-4 border-t border-border/30 mt-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onSettingsClick} 
                  className="rounded-lg hover:bg-muted/80 transition-colors h-8 w-8"
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
                  className="rounded-lg hover:bg-muted/80 transition-colors h-8 w-8"
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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-lg hover:bg-muted/80 transition-colors h-8 w-8"
                  aria-label="GitHub Repository"
                  as="a"
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">GitHub Repository</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
