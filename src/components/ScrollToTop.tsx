import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowUpToLine } from "lucide-react";

export const ScrollToTop = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 transition-all duration-300 ${
        showTopBtn
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Button
        onClick={goToTop}
        size="icon"
        className="shadow-lg backdrop-blur bg-red-700/90 hover:bg-red-800 hover:scale-110 transition-all duration-200 text-white"
      >
        <ArrowUpToLine className="h-4 w-4" />
      </Button>
    </div>
  );
};