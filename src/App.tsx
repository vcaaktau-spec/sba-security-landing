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
import { Statistics } from "./components/Statistics"; // Добавили импорт новой секции
import "./App.css";

function App() {
  return (
    <main className="h-screen overflow-y-auto snap-y snap-proximity scroll-smooth -webkit-overflow-scrolling-touch">
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
  );
}

export default App;