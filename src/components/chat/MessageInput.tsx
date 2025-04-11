
import React, { useState, useRef } from "react";
import { useChat } from "@/providers/ChatProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Mic, Square, Image, Palette, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function MessageInput() {
  const { sendMessage, isLoading } = useChat();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      sendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File attached",
        description: `${file.name} (${Math.round(file.size / 1024)} KB)`,
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak now. Click the button again to stop recording.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access the microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording stopped",
      description: "Processing your audio...",
    });
    
    setTimeout(() => {
      setMessage(message + " [Voice transcript would appear here]");
      toast({
        title: "Voice processed",
        description: "Your voice has been transcribed.",
      });
    }, 1500);
  };

  return (
    <div className="flex items-end gap-2 neo-effect border border-border/30 rounded-2xl p-3 shadow-lg">
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0 rounded-xl hover:bg-secondary/80 hover:text-primary" 
          onClick={handleFileAttachment}
          title="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="shrink-0 rounded-xl hover:bg-secondary/80 hover:text-primary" 
          onClick={() => toast({ description: "Image upload coming soon!" })}
          title="Attach image"
        >
          <Image className="h-5 w-5" />
        </Button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      
      <Textarea
        ref={textareaRef}
        placeholder="Type your message to Gemini..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        className="min-h-10 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        disabled={isLoading || isRecording}
      />
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`shrink-0 rounded-xl ${isRecording ? 'bg-red-500 text-white hover:bg-red-600 pulse-effect' : 'hover:bg-secondary/80 hover:text-primary'}`}
          onClick={toggleVoiceRecording}
          title={isRecording ? "Stop recording" : "Start voice recording"}
        >
          {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading || isRecording}
          className="shrink-0 bg-primary hover:bg-primary/90 rounded-xl hover-scale shadow-md"
          title="Send message"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
