
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "./SettingsProvider";

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
  filteredChats: Chat[];
  currentChat: Chat | null;
  createNewChat: () => void;
  saveChat: (chat: Chat) => void;
  deleteChat: (chatId: string) => void;
  setCurrentChat: (chatId: string) => void;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => Message;
  updateMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  starChat: (chatId: string, starred: boolean) => void;
  sendMessage: (message: string) => Promise<void>;
  searchChats: (query: string) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { settings } = useSettings();
  const [chats, setChats] = useLocalStorage<Chat[]>("gemini-chats", []);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useLocalStorage<string | null>("gemini-current-chat", null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentChat = chats.find(chat => chat.id === currentChatId) || null;

  // Initialize filtered chats with all chats
  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

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
    if (!currentChat) return {} as Message;

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

  // New search function
  const searchChats = (query: string) => {
    if (!query.trim()) {
      setFilteredChats(chats);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = chats.filter(chat => {
      // Search in chat title
      if (chat.title.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Search in chat messages
      return chat.messages.some(message => 
        message.content.toLowerCase().includes(lowerQuery)
      );
    });
    
    setFilteredChats(results);
  };

  // This function will call the Gemini API with the user's message
  const sendMessage = async (message: string) => {
    if (!settings.apiKey) {
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
      const modelId = settings.model;
      console.log(`Using model: ${modelId}`);

      // Get conversation history for context if not in stateless mode
      let conversationHistory: { role: string, parts: { text: string }[] }[] = [];
      
      if (!settings.statelessMode && currentChat) {
        // Format previous messages for the API
        // Maximum of 10 previous messages to prevent context length issues
        const previousMessages = currentChat.messages
          .slice(-10) // Last 10 messages
          .filter(msg => msg.id !== aiMessage.id && msg.id !== userMessage.id);
        
        conversationHistory = previousMessages.map(msg => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        }));
      }

      // Call the Google Generative AI API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${settings.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            ...conversationHistory,
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: settings.temperature,
            maxOutputTokens: settings.maxTokens,
            topK: settings.topK,
            topP: settings.topP,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error calling Gemini API');
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const responseText = data.candidates[0].content.parts
          .map((part: { text?: string }) => part.text || '')
          .join('');
        
        updateMessage(aiMessage.id, responseText);
      } else {
        throw new Error('No response from the model');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get a response from Gemini",
        variant: "destructive",
      });
      
      updateMessage(aiMessage.id, "I'm sorry, I encountered an error while processing your request.");
    } finally {
      setIsLoading(false);
    }
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
        filteredChats,
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
        searchChats,
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
