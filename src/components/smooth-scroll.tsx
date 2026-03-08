"use client"

import Lenis from 'lenis'
import { useEffect } from 'react'

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      wheelMultiplier: 1,
      touchMultiplier: 2, 
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // === ПРЕМИАЛЬНЫЙ МАГНИТ (ДОВОДЧИК) ===
    let scrollTimeout: NodeJS.Timeout;
    
    lenis.on('scroll', () => {
      // Сбрасываем таймер, пока человек активно крутит колесо
      clearTimeout(scrollTimeout);
      
      // Как только скролл остановился на 150мс — проверяем, где мы
      scrollTimeout = setTimeout(() => {
        // Ищем все секции с классом magnet-section
        const sections = document.querySelectorAll('.magnet-section');
        let closestSection: Element | null = null;
        let minDistance = Infinity;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const distance = Math.abs(rect.top); // Расстояние от верха экрана до верха секции
          
          // Если мы остановились в пределах 300px от начала секции — магнитимся
          if (distance < 300 && distance < minDistance) {
            minDistance = distance;
            closestSection = section;
          }
        });

        // Если нашли секцию поблизости и мы еще не стоим ровно на ней (minDistance > 5)
        if (closestSection && minDistance > 5) {
          lenis.scrollTo(closestSection, {
            duration: 1, // Мягкая доводка за 1 секунду
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }, 150); 
    });

    return () => {
      clearTimeout(scrollTimeout);
      lenis.destroy();
    }
  }, [])

  return <>{children}</>
}