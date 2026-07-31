import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { translations, type Language } from "./i18n";
import { createStorage } from "./storage";

const languageStore = createStorage("language");

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (typeof translations)["en"];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: string | null): value is Language {
  return value === "en" || value === "fr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    (async () => {
      const stored = await languageStore.get();
      if (isLanguage(stored)) setLanguageState(stored);
    })();
  }, []);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    languageStore.set(next);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
