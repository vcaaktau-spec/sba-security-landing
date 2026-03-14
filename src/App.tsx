import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cta } from "./components/Cta";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { Services } from "./components/Services";
import { Projects } from "./components/Projects";
import { Testimonials } from "./components/Testimonials";
import { Statistics } from "./components/Statistics";
import { SmoothScroll } from "./components/smooth-scroll";
import { Preloader } from "./components/Preloader";
import { GlobalBackground } from "./components/GlobalBackground";
import { Calculator } from "./components/Calculator";
import { X } from "lucide-react";
import "./App.css";
import { SbaPlanner } from "./components/SbaPlanner";
import NotFound from "./components/NotFound";
import { SeoBlock } from "./components/SeoBlock";

// ИСПРАВЛЕНИЕ: Меняем /next на /react
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const GlassWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full bg-background/10 dark:bg-background/10 backdrop-blur-sm border-b border-foreground/5 transition-colors duration-700"
    >
      {children}
    </motion.div>
  );
};

function App() {
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  // Блокировка скролла при открытой модалке
  useEffect(() => {
    if (isCalcOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isCalcOpen]);

  // --- НАТИВНЫЙ ПЕРЕХВАТЧИК ДЛЯ 404 СТРАНИЦЫ ---
  const currentPath = window.location.pathname;
  if (currentPath !== "/" && currentPath !== "/index.html") {
    return <NotFound />;
  }

  return (
    <>
      <Preloader /> 
      
      {/* 1. Фон всегда в самом низу */}
      <GlobalBackground />

      <SmoothScroll>
        <main className="relative flex flex-col min-h-screen">
          <Navbar />
          
          <GlassWrapper>
            {/* Передаем функцию открытия в Hero */}
            <Hero onOpenCalc={() => setIsCalcOpen(true)} />
          </GlassWrapper>
          
          <GlassWrapper><Statistics /></GlassWrapper>
          <GlassWrapper><HowItWorks /></GlassWrapper>
          <GlassWrapper><Features /></GlassWrapper>
          <GlassWrapper><Services /></GlassWrapper>
          <GlassWrapper>
            <div className="max-w-[1200px] mx-auto py-20 px-6">
              <h2 className="text-3xl font-black uppercase mb-10">Конструктор объекта <span className="text-red-600">Beta</span></h2>
              <SbaPlanner />
            </div>
          </GlassWrapper>
          <GlassWrapper><Projects /></GlassWrapper>
          <GlassWrapper><Testimonials /></GlassWrapper>
          <GlassWrapper><Cta /></GlassWrapper>
          <GlassWrapper>
            <SeoBlock />
          </GlassWrapper>
          <GlassWrapper>
            <Footer onOpenCalc={() => setIsCalcOpen(true)} />
          </GlassWrapper>

          <ScrollToTop />
        </main>
      </SmoothScroll>

      {/* 2. МОДАЛКА ВНЕ СКРОЛЛА (Портал) */}
      <AnimatePresence>
        {isCalcOpen && (
          <div className="fixed inset-0 z-[999] flex justify-center items-center text-foreground">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsCalcOpen(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-md cursor-pointer"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full lg:h-[90vh] lg:max-w-5xl lg:rounded-3xl bg-background border border-border/50 shadow-2xl flex flex-col overflow-hidden m-0 lg:m-4"
            >
              <button 
                onClick={() => setIsCalcOpen(false)} 
                className="absolute top-4 right-4 z-[1000] w-12 h-12 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center border border-border transition-transform hover:rotate-90"
              >
                <X size={24} />
              </button>
              
              <div className="flex-grow overflow-y-auto custom-scrollbar">
                <Calculator onClose={() => setIsCalcOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* ИСПРАВЛЕНИЕ: Вынесли компоненты Vercel за пределы AnimatePresence */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;