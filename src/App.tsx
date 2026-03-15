import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Admin } from "./pages/Admin";
import NotFound from "./components/NotFound";
import { GlobalBackground } from "./components/GlobalBackground";
import { Preloader } from "./components/Preloader";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <GlobalBackground />
      
      <Routes>
        <Route path="/" element={<Home />} />
        
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
                <Admin />
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