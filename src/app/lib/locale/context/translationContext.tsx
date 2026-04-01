"use client";
import { loadNamespaces } from "../i18n/loadNamespace";
import { TranslationSchema } from "../i18n/schema";
import { Locale } from "../i18n/types";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";

type MessageNamespace = Record<string, string>;

type Messages = Partial<TranslationSchema>;

const TranslationContext = createContext<{
  messages: Messages;
  locale: Locale;
  setLocale: Dispatch<SetStateAction<Locale>>;
} | null>(null);

export function TranslationProvider({
  children,
  initialMessages,
  initialLocale,
}: {
  children: React.ReactNode;
  initialMessages: Messages;
  initialLocale: Locale;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    // Don't re-fetch when the initial locale is the same and we have messages
    if (
      initialLocale === locale &&
      initialMessages &&
      Object.keys(initialMessages).length > 0
    ) {
      return;
    }

    let cancelled = false;
    (async () => {
      const newMessages = await loadNamespaces(locale, [
        "asint",
        "extraction",
        "main",
      ]);

      if (!cancelled) setMessages(newMessages);
    })();

    return () => {
      cancelled = true;
    };
  }, [locale, initialLocale, initialMessages]);

  return (
    <TranslationContext.Provider value={{ messages, locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations<K extends keyof TranslationSchema>(ns: K) {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("No TranslationContext found!");
  return (ctx.messages[ns] ?? {}) as TranslationSchema[K];
}

export function useLocale() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("No TranslationContext found!");
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}
