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
    <>
      <Navbar />
      <Hero />
      <Statistics /> {/* Вставили нашу новую премиум-секцию вместо About */}
      <HowItWorks />
      <Features />
      <Services />
      <Projects />
      <Testimonials />
      <Cta />
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;