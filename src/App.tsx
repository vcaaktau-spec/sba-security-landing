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
import "./App.css";
import { GlobalBackground } from "./components/GlobalBackground";

function App() {
  return (
    <>
      <Preloader /> 
      
      <SmoothScroll>
        <main className="flex flex-col min-h-screen">
          <GlobalBackground />
          <Navbar />
          <Hero />
          <Statistics />
          <HowItWorks />
          <Features />
          <Services />
          <Projects />
          <Testimonials />
          <Cta />
          <Footer />
          <ScrollToTop />
        </main>
      </SmoothScroll>
    </>
  );
}

export default App;