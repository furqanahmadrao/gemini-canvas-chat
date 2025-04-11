
import React, { useState } from "react";
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const settingsFormSchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [showApiKey, setShowApiKey] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize form with current API key
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      apiKey: settings.apiKey || "",
    },
  });

  const handleSaveApiKey = (values: SettingsFormValues) => {
    updateSettings("apiKey", values.apiKey);
    toast({
      title: "API key saved",
      description: "Your Gemini API key has been updated",
    });
  };

  const handleClearApiKey = () => {
    form.setValue("apiKey", "");
    updateSettings("apiKey", null);
    toast({
      title: "API key cleared",
      description: "Your Gemini API key has been removed",
    });
  };

  const copyApiKey = () => {
    if (settings.apiKey) {
      navigator.clipboard.writeText(settings.apiKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Copied",
        description: "API key copied to clipboard",
      });
    }
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveApiKey)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gemini API Key</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showApiKey ? "text" : "password"}
                              placeholder="Enter your API key"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full"
                              onClick={toggleShowApiKey}
                            >
                              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        {settings.apiKey && (
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={copyApiKey}
                            title="Copy API key"
                          >
                            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                      <FormDescription>
                        Your API key is stored locally in your browser's storage.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={handleClearApiKey}>
                    Clear API Key
                  </Button>
                  <Button type="submit">Save API Key</Button>
                </div>
              </form>
            </Form>

            <div className="text-sm text-muted-foreground mt-4 border-t pt-4">
              <p>Don't have an API key?</p>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Get a Gemini API key from Google AI Studio
              </a>
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
                  <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                  <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                  <SelectItem value="gemini-1.0-pro">Gemini 1.0 Pro</SelectItem>
                  <SelectItem value="gemini-1.0-pro-vision">Gemini 1.0 Pro Vision</SelectItem>
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
            
            <div>
              <Label>Top K: {settings.topK}</Label>
              <Slider
                value={[settings.topK]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => updateSettings("topK", value[0])}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Limits token selection to the top K options at each step.
              </p>
            </div>
            
            <div>
              <Label>Top P: {settings.topP}</Label>
              <Slider
                value={[settings.topP]}
                min={0.1}
                max={1}
                step={0.05}
                onValueChange={(value) => updateSettings("topP", value[0])}
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Limits token selection to a subset that adds up to a probability of Top P.
              </p>
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
