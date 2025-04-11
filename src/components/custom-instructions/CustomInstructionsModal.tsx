
import { useState } from "react";
import { useSettings } from "@/providers/SettingsProvider";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomInstructionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomInstructionsModal({ 
  open, 
  onOpenChange 
}: CustomInstructionsModalProps) {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [instructions, setInstructions] = useState(settings.customInstructions || "");

  const handleSave = () => {
    updateSettings("customInstructions", instructions);
    toast({
      title: "Instructions saved",
      description: "Your custom instructions have been updated",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Custom Instructions</DialogTitle>
          <DialogDescription>
            Add instructions that will be applied to all your chats with Mind Labs
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <Textarea
            placeholder="Example: I'm a data scientist working with Python. Please provide code examples and explain technical concepts in detail."
            className="min-h-[150px]"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
          
          <div className="text-sm text-muted-foreground">
            <p>Your instructions will automatically be included in all future conversations.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Instructions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
