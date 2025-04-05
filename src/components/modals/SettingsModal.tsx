
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettings, AIModel } from "@/providers/SettingsProvider";
import { useTheme } from "@/providers/ThemeProvider";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [apiKey, setApiKey] = React.useState(settings.apiKey || "");

  const handleSaveApiKey = () => {
    updateSettings("apiKey", apiKey);
    toast({
      title: "API key saved",
      description: "Your Gemini API key has been updated",
    });
  };

  const handleClearApiKey = () => {
    setApiKey("");
    updateSettings("apiKey", null);
    toast({
      title: "API key cleared",
      description: "Your Gemini API key has been removed",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your Gemini Chatbot experience
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api-key" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="api-key">API Key</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api-key" className="space-y-4">
            <div>
              <Label htmlFor="api-key">Gemini API Key</Label>
              <Input
                id="api-key"
                value={apiKey || ""}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                placeholder="Enter your API key"
                className="mt-1"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Your API key is stored locally in your browser's storage.
              </p>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleClearApiKey}>
                Clear API Key
              </Button>
              <Button onClick={handleSaveApiKey}>Save API Key</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <div>
              <Label>Theme</Label>
              <Select
                value={theme}
                onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Text Size</Label>
              <Select
                value={settings.textSize}
                onValueChange={(value) => updateSettings("textSize", value as "small" | "medium" | "large")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select text size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Message Layout</Label>
              <Select
                value={settings.messageLayout}
                onValueChange={(value) => updateSettings("messageLayout", value as "default" | "compact")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label>Gemini Model</Label>
              <Select
                value={settings.model}
                onValueChange={(value) => updateSettings("model", value as AIModel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                  <SelectItem value="gemini-pro-vision">Gemini Pro Vision</SelectItem>
                  <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                  <SelectItem value="gemini-flash">Gemini Flash</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Different models have different capabilities and pricing.
              </p>
            </div>
            
            <div>
              <Label>Temperature: {settings.temperature}</Label>
              <Slider
                value={[settings.temperature]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(value) => updateSettings("temperature", value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>Precise</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>
            
            <div>
              <Label>Maximum Tokens: {settings.maxTokens}</Label>
              <Slider
                value={[settings.maxTokens]}
                min={256}
                max={4096}
                step={256}
                onValueChange={(value) => updateSettings("maxTokens", value[0])}
                className="mt-2"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="stateless-mode" className="text-base">Stateless Mode</Label>
                <p className="text-sm text-muted-foreground">
                  The AI won't remember previous messages in the conversation
                </p>
              </div>
              <Switch
                id="stateless-mode"
                checked={settings.statelessMode}
                onCheckedChange={(checked) => updateSettings("statelessMode", checked)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
