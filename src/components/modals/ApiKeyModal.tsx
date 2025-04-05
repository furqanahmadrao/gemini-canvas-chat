
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/providers/SettingsProvider";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";

export function ApiKeyModal() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [open, setOpen] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    // Store the API key
    updateSettings("apiKey", apiKey);
    
    toast({
      title: "API key saved",
      description: "Your Gemini API key has been saved",
    });
    
    setOpen(false);
  };
  
  const handleSkip = () => {
    toast({
      description: "You can add your API key later in Settings",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter your Gemini API Key</DialogTitle>
          <DialogDescription>
            Your API key is stored locally and never sent to our servers.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full"
          />
          
          <div className="text-sm text-muted-foreground">
            <p>Don't have an API key?</p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center text-primary hover:underline mt-1"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Get a Gemini API key
            </a>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button type="submit">Save API Key</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
