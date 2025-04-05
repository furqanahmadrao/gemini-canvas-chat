
import React, { useState, useRef } from "react";
import { useChat } from "@/providers/ChatProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Mic, Square } from "lucide-react";
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

  // Auto-resize the textarea
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  // Handle file attachment
  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, just show a toast notification
      toast({
        title: "File attached",
        description: `${file.name} (${Math.round(file.size / 1024)} KB)`,
      });
      
      // Clear the input for future selections
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // In a real implementation, we would handle the file upload logic here
    }
  };

  // Handle voice recording
  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      // Request microphone permissions
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak now. Click the button again to stop recording.",
      });
      
      // In a real implementation, we would start recording here
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
    
    // Simulate processing time
    setTimeout(() => {
      setMessage(message + " [Voice transcript would appear here]");
      toast({
        title: "Voice processed",
        description: "Your voice has been transcribed.",
      });
    }, 1500);
    
    // In a real implementation, we would stop recording and process the audio here
  };

  return (
    <div className="flex items-end gap-2 bg-card border border-border rounded-lg p-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="shrink-0" 
        onClick={handleFileAttachment}
      >
        <Paperclip className="h-5 w-5" />
      </Button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      
      <Textarea
        ref={textareaRef}
        placeholder="Message Gemini..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        className="min-h-10 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={isLoading || isRecording}
      />
      
      <div className="flex gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`shrink-0 ${isRecording ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
          onClick={toggleVoiceRecording}
        >
          {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading || isRecording}
          className="shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
