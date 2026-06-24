import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Videonahljudenie } from "./pages/services/Videonahljudenie";
import { Skud } from "./pages/services/Skud";
import { Signalizaciya } from "./pages/services/Signalizaciya";
import { Seti } from "./pages/services/Seti";
import NotFound from "./components/NotFound";
import { GlobalBackground } from "./components/GlobalBackground";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <GlobalBackground />
      
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Страницы услуг */}
        <Route path="/uslugi/videonahljudenie" element={<Videonahljudenie />} />
        <Route path="/uslugi/skud" element={<Skud />} />
        <Route path="/uslugi/signalizaciya" element={<Signalizaciya />} />
        <Route path="/uslugi/seti" element={<Seti />} />

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
    </BrowserRouter>
  );
}

export default App;