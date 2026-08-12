import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Calculator } from "../components/Calculator";
import { Cta } from "../components/Cta";
import { DotMatrix } from "../components/DotMatrix";
import { Features } from "../components/Features";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { HowItWorks } from "../components/HowItWorks";
import { Navbar } from "../components/Navbar";
import { PainSection } from "../components/PainSection";
import { Projects } from "../components/Projects";
import { SeoBlock } from "../components/SeoBlock";
import { Services } from "../components/Services";
import { SmoothScroll } from "../components/smooth-scroll";
import { Statistics } from "../components/Statistics";
import { Testimonials } from "../components/Testimonials";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Section reveal — large y movement + scale for visible scroll animation */
const FadeSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 70, scale: 0.985 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 1.0, ease, delay }}
    className="relative z-10 w-full"
  >
    {children}
  </motion.div>
);

/* Dot matrix accent between sections */
const SectionAccent = ({ side = "right" }: { side?: "left" | "right" }) => (
  <div className={`relative h-0 overflow-visible pointer-events-none ${side === "right" ? "flex justify-end" : "flex justify-start"}`}>
    <DotMatrix
      cols={9} rows={5}
      className={`relative -top-6 ${side === "right" ? "mr-6 lg:mr-16" : "ml-6 lg:ml-16"} text-white/[0.18]`}
    />
  </div>
);

export const Home = () => {
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isCalcOpen ? "hidden" : "unset";
  }, [isCalcOpen]);

  return (
    <>
      <SmoothScroll>
        <main className="relative flex flex-col min-h-screen bg-background">
          <Navbar />

          {/* Hero — no fade, instant */}
          <Hero />

          {/* Порядок блоков по concept 2026 (docs/CONCEPT-2026.md, раздел 2):
              Hero → боли → плюсы → остальное. TwoPathsSection убрана — Hero
              теперь сам ведёт прямо в каталог, отдельный "выбор пути" не
              нужен (см. обсуждение редизайна Hero). */}
          <FadeSection><PainSection /></FadeSection>
          <SectionAccent side="left" />
          <FadeSection><Features /></FadeSection>
          <SectionAccent side="right" />
          <FadeSection><Statistics /></FadeSection>
          <SectionAccent side="left" />
          <FadeSection><HowItWorks /></FadeSection>
          <SectionAccent side="right" />
          <FadeSection><Services /></FadeSection>
          <SectionAccent side="left" />
          <FadeSection><Projects /></FadeSection>
          <FadeSection><Testimonials /></FadeSection>
          <SectionAccent side="right" />
          <FadeSection><Cta /></FadeSection>
          <FadeSection><SeoBlock /></FadeSection>
          <FadeSection><Footer onOpenCalc={() => setIsCalcOpen(true)} /></FadeSection>
        </main>
      </SmoothScroll>

      <AnimatePresence>
        {isCalcOpen && (
          <div className="fixed inset-0 z-[999] flex justify-center items-center text-foreground">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCalcOpen(false)}
              className="absolute inset-0 bg-background/92 backdrop-blur-lg cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full h-full lg:h-[90vh] lg:max-w-5xl lg:rounded-3xl bg-background border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden m-0 lg:m-4"
            >
              <button
                onClick={() => setIsCalcOpen(false)}
                className="absolute top-4 right-4 z-[1000] w-11 h-11 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center border border-white/[0.08] transition-all duration-200 hover:rotate-90"
              >
                <X size={20} />
              </button>
              <div className="flex-grow overflow-y-auto custom-scrollbar">
                <Calculator onClose={() => setIsCalcOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
