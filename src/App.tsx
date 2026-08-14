import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Home } from "./pages/Home";
import { Katalog } from "./pages/Katalog";
import { ProductDetail } from "./pages/ProductDetail";
import { Dashboard } from "./pages/Dashboard";
import { Videonahljudenie } from "./pages/services/Videonahljudenie";
import { Skud } from "./pages/services/Skud";
import { Signalizaciya } from "./pages/services/Signalizaciya";
import { Seti } from "./pages/services/Seti";
import NotFound from "./components/NotFound";
import { GlobalBackground } from "./components/GlobalBackground";
import { LocaleGate } from "./components/LocaleGate";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { CartProvider } from "./contexts/CartContext";
import "./App.css";

// Маршрутизируемые (не auth/dashboard) страницы — сейчас доступны на
// русском (без префикса) и английском (/en/...). Казахский пока только
// переключатель интерфейса, без своего URL (см. src/lib/locale.ts).
const marketingRoutes: { path: string; element: JSX.Element }[] = [
  { path: "/", element: <Home /> },
  { path: "/katalog", element: <Katalog /> },
  { path: "/uslugi/videonahljudenie", element: <Videonahljudenie /> },
  { path: "/uslugi/skud", element: <Skud /> },
  { path: "/uslugi/signalizaciya", element: <Signalizaciya /> },
  { path: "/uslugi/seti", element: <Seti /> },
];

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <GlobalBackground />

        <Routes>
          {marketingRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={<LocaleGate lang="ru">{r.element}</LocaleGate>} />
          ))}
          {marketingRoutes.map((r) => (
            <Route
              key={`en${r.path}`}
              path={r.path === "/" ? "/en" : `/en${r.path}`}
              element={<LocaleGate lang="en">{r.element}</LocaleGate>}
            />
          ))}

          {/* Страница товара: данные каталога (название, характеристики) —
              только на русском, из Barlau, машинный перевод без проверки не
              делаем (см. обсуждение Critical #3). Интерфейс вокруг данных
              при этом следует текущему языку — маршрут без обёртки
              LocaleGate, чтобы не сбрасывать язык при переходе с /en/katalog. */}
          <Route path="/katalog/:id" element={<ProductDetail />} />

          {/* Кабинет клиента */}
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            }
          />

          {/* Панель Администратора */}
          <Route
            path="/admin"
            element={
              <>
                <SignedIn>
                </SignedIn>
                <SignedOut>
                  <Navigate to="/" replace />
                </SignedOut>
              </>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Analytics />
        <SpeedInsights />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;