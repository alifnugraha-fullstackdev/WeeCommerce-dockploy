'use client';
import { MessageCircle } from 'lucide-react';
import { useEffect } from 'react';

const WA_NUMBER = '6281234567890';
const WA_MSG = encodeURIComponent('Hi WeeCommerce! I want to discuss my project.');

export function WhatsAppCTA() {
  useEffect(() => {
    const track = () => {
      if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible('whatsapp_click');
      }
    };
    const el = document.getElementById('whatsapp-cta');
    el?.addEventListener('click', track);
    return () => el?.removeEventListener('click', track);
  }, []);

  return (
    <a
      id="whatsapp-cta"
      href={`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
