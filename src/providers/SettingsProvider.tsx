
import React, { createContext, useContext } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type AIModel = "gemini-pro" | "gemini-pro-vision" | "gemini-ultra" | "gemini-flash";

interface Settings {
  apiKey: string | null;
  model: AIModel;
  temperature: number;
  maxTokens: number;
  messageLayout: "default" | "compact";
  textSize: "small" | "medium" | "large";
  statelessMode: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  apiKey: null,
  model: "gemini-pro",
  temperature: 0.7,
  maxTokens: 1024,
  messageLayout: "default",
  textSize: "medium",
  statelessMode: false,
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
