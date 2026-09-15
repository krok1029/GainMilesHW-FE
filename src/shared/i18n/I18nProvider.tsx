import { createContext, PropsWithChildren, useContext, useState } from "react";
import { getLocales } from "expo-localization";
import { en, Messages, zh } from "./messages";

export type Locale = "en" | "zh-HK";

export function resolveLocale(languageCode?: string | null): Locale {
  return languageCode?.toLowerCase().startsWith("zh") ? "zh-HK" : "en";
}

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
} | null>(null);

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>(() =>
    resolveLocale(getLocales()[0]?.languageCode),
  );

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t: locale === "en" ? en : zh }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) throw new Error("I18nProvider is missing");

  return context;
}
