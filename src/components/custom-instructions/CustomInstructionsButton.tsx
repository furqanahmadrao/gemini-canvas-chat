
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { CustomInstructionsModal } from "./CustomInstructionsModal";
import { useSettings } from "@/providers/SettingsProvider";
import { Button } from "@/components/ui/button";

export function CustomInstructionsButton() {
  const [open, setOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setOpen(true)}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <Sparkles className="h-4 w-4" />
        <span>{settings.customInstructions ? "Edit Instructions" : "Custom Instructions"}</span>
      </Button>
      <CustomInstructionsModal open={open} onOpenChange={setOpen} />
    </>
  );
}
