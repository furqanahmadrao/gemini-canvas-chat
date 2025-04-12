
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { CustomInstructionsModal } from "./CustomInstructionsModal";
import { useSettings } from "@/providers/SettingsProvider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function CustomInstructionsButton() {
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(true)}
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              <Sparkles className="h-4 w-4" />
              <span className="sr-only">
                {settings.customInstructions ? "Edit Instructions" : "Custom Instructions"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{settings.customInstructions ? "Edit Instructions" : "Custom Instructions"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CustomInstructionsModal open={open} onOpenChange={setOpen} />
    </>
  );
}
