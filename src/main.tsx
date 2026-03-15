import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider, useTheme } from "@/components/theme-provider.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { ruRU, enUS } from "@clerk/localizations";
import { useTranslation } from "react-i18next";
import "./index.css";
import './i18n';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Убедитесь, что VITE_CLERK_PUBLISHABLE_KEY добавлен в .env");
}

// Создаем обертку, чтобы Clerk мог реагировать на смену темы и языка
const ClerkThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();

  // Clerk пока не имеет официального 'kz', поэтому для казахского используем английский или русский (по умолчанию ru)
  const locale = i18n.language === 'en' ? enUS : ruRU;

  return (
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      localization={locale}
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: '#dc2626', // Красный цвет акцентов как на сайте
        },
        elements: {
          card: "bg-background border border-border shadow-2xl", // Подстраиваем фон модалки под Tailwind
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ClerkThemeWrapper>
        <App />
      </ClerkThemeWrapper>
    </ThemeProvider>
  </React.StrictMode>
);