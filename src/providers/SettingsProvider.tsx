
import React, { createContext, useContext } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type AIModel = 
  | "gemini-1.0-pro" 
  | "gemini-1.0-pro-vision" 
  | "gemini-1.5-pro" 
  | "gemini-1.5-flash";

interface Settings {
  apiKey: string | null;
  model: AIModel;
  temperature: number;
  maxTokens: number;
  topK: number;
  topP: number;
  messageLayout: "default" | "compact";
  textSize: "small" | "medium" | "large";
  statelessMode: boolean;
  customInstructions: string | null;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  apiKey: null,
  model: "gemini-1.5-pro",
  temperature: 0.7,
  maxTokens: 1024,
  topK: 40,
  topP: 0.95,
  messageLayout: "default",
  textSize: "medium",
  statelessMode: false,
  customInstructions: null,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useLocalStorage<Settings>(
    "gemini-settings",
    defaultSettings
  );

  const updateSettings = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings({ ...settings, [key]: value });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
