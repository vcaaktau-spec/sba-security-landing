"use client"

import Lenis from 'lenis'
import { useEffect } from 'react'

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, 
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      wheelMultiplier: 1,
      touchMultiplier: 2, // Оставили твой параметр, остальное Lenis сделает сам
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // === ПРЕМИАЛЬНЫЙ МАГНИТ (ОПТИМИЗИРОВАННЫЙ) ===
    let scrollTimeout: NodeJS.Timeout;
    
    // Кешируем секции
    const sections = document.querySelectorAll('.magnet-section');
    
    // Проверяем, мобилка ли это (чтобы не душить телефон доводчиком)
    const isMobile = window.innerWidth < 768;

    // Включаем доводчик ТОЛЬКО на десктопе (для мышки/тачпада)
    if (!isMobile && sections.length > 0) {
      lenis.on('scroll', (e: any) => {
        // Если страница еще летит по инерции — ничего не делаем
        if (Math.abs(e.velocity) > 0.1) return;

        clearTimeout(scrollTimeout);
        
        scrollTimeout = setTimeout(() => {
          let closestSection: Element | null = null;
          let minDistance = Infinity;

          sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top); 
            
            if (distance < 300 && distance < minDistance) {
              minDistance = distance;
              closestSection = section;
            }
          });

          if (closestSection && minDistance > 5) {
            lenis.scrollTo(closestSection, {
              duration: 1, 
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        }, 150); 
      });
    }

    return () => {
      clearTimeout(scrollTimeout);
      lenis.destroy();
    }
  }, [])

  return <>{children}</>
}