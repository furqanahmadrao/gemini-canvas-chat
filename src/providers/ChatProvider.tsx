
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  starred?: boolean;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  createNewChat: () => void;
  saveChat: (chat: Chat) => void;
  deleteChat: (chatId: string) => void;
  setCurrentChat: (chatId: string) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  updateMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  starChat: (chatId: string, starred: boolean) => void;
  sendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [apiKey, setApiKey] = useLocalStorage<string | null>("gemini-api-key", null);
  const [chats, setChats] = useLocalStorage<Chat[]>("gemini-chats", []);
  const [currentChatId, setCurrentChatId] = useLocalStorage<string | null>("gemini-current-chat", null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentChat = chats.find(chat => chat.id === currentChatId) || null;

  const createNewChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
  };

  const saveChat = (chat: Chat) => {
    setChats(chats.map(c => c.id === chat.id ? { ...chat, updatedAt: Date.now() } : c));
  };

  const deleteChat = (chatId: string) => {
    setChats(chats.filter(c => c.id !== chatId));
    if (currentChatId === chatId) {
      if (chats.length > 1) {
        const nextChat = chats.find(c => c.id !== chatId);
        setCurrentChatId(nextChat?.id || null);
      } else {
        setCurrentChatId(null);
      }
    }
  };

  const setCurrentChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    if (!currentChat) return;

    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, newMessage],
      updatedAt: Date.now(),
    };

    if (updatedChat.messages.length === 1) {
      // This is the first message, update the chat title
      updatedChat.title = message.content.slice(0, 30) + (message.content.length > 30 ? "..." : "");
    }

    saveChat(updatedChat);
    return newMessage;
  };

  const updateMessage = (messageId: string, content: string) => {
    if (!currentChat) return;

    const updatedMessages = currentChat.messages.map(msg =>
      msg.id === messageId ? { ...msg, content } : msg
    );

    saveChat({
      ...currentChat,
      messages: updatedMessages,
    });
  };

  const deleteMessage = (messageId: string) => {
    if (!currentChat) return;

    const updatedMessages = currentChat.messages.filter(msg => msg.id !== messageId);

    saveChat({
      ...currentChat,
      messages: updatedMessages,
    });
  };

  const starChat = (chatId: string, starred: boolean) => {
    setChats(
      chats.map(chat =>
        chat.id === chatId ? { ...chat, starred, updatedAt: Date.now() } : chat
      )
    );
  };

  // This function will call the Gemini API with the user's message and stream the response
  const sendMessage = async (message: string) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key in settings",
        variant: "destructive",
      });
      return;
    }

    if (!currentChat) {
      createNewChat();
    }

    // Add the user message first
    const userMessage = addMessage({
      role: "user",
      content: message,
    });

    // Create a placeholder for the AI message
    const aiMessage = addMessage({
      role: "assistant",
      content: "",
    });

    setIsLoading(true);

    try {
      // Simulate the API call for now
      const response = await simulateStreamingResponse(message, (partialResponse) => {
        updateMessage(aiMessage!.id, partialResponse);
      });
      
      // Final update with complete response
      updateMessage(aiMessage!.id, response);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from Gemini. Please try again.",
        variant: "destructive",
      });
      // Update AI message to show error
      updateMessage(aiMessage!.id, "I'm sorry, I encountered an error while processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate streaming response (this would be replaced with real API call)
  const simulateStreamingResponse = async (
    message: string, 
    onPartialResponse: (text: string) => void
  ): Promise<string> => {
    const responses = [
      "I'm analyzing your question...",
      "Based on my understanding, here's what I can tell you:",
      "This is a simulated response from the Gemini API. In a real implementation, this would be streaming from the API.",
      "Your message was: " + message,
      "\n\nYou can provide your actual Gemini API key in settings to get real responses.",
      "\n\nSome things you can try:\n- Ask me about code\n- Request information on a topic\n- Ask me to write something creative",
    ];
    
    let fullResponse = "";
    
    for (const part of responses) {
      await new Promise(resolve => setTimeout(resolve, 500));
      fullResponse += " " + part;
      onPartialResponse(fullResponse);
    }
    
    return fullResponse;
  };

  // Effect to create a new chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    } else if (!currentChatId) {
      setCurrentChatId(chats[0].id);
    }
  }, [chats, currentChatId]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        createNewChat,
        saveChat,
        deleteChat,
        setCurrentChat,
        addMessage,
        updateMessage,
        deleteMessage,
        starChat,
        sendMessage,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
