'use client';
import { useEffect, useRef } from 'react';

export function SectionReveal() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.filter = 'blur(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' },
    );

    const main = document.querySelector('main');
    if (main) {
      main.querySelectorAll(':scope > section').forEach((section) => {
        const el = section as HTMLElement;
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.filter = 'blur(1px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out, filter 0.6s ease-out';
        observer.observe(el);
      });
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
