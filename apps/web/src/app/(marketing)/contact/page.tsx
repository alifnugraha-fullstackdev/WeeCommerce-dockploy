"use client";
import { useState } from "react";
import {
  PhoneCall,
  MessageCircle,
  Mail,
  Send,
  ChevronDown,
  ArrowRight,
  Camera,
  Globe,
  MessageSquare,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { BookingForm } from "@/components/booking-form";

const channels = [
  {
    id: "call",
    title: "Book a Call",
    desc: "30-minute discovery call. No sales pitch — just us understanding your business.",
    action: "Schedule a Call",
    icon: PhoneCall,
    gradient: "from-teal-400/20 via-teal-400/10 to-transparent",
    border: "hover:border-teal-500/40",
  },
  {
    id: "whatsapp",
    title: "Chat on WhatsApp",
    desc: "Fast response. Drop us a message and we'll reply within minutes during business hours.",
    action: "Chat Now",
    href: "https://wa.me/6281234567890?text=Hi%20WeeCommerce!%20I%20want%20to%20discuss%20my%20project.",
    icon: MessageCircle,
    gradient: "from-emerald-400/20 via-emerald-400/10 to-transparent",
    border: "hover:border-emerald-500/40",
  },
  {
    id: "email",
    title: "Send an Email",
    desc: "Prefer writing? Send us a detailed message and we'll reply within 24 hours.",
    action: "hello@weecommerce.web.id",
    href: "mailto:hello@weecommerce.web.id",
    icon: Mail,
    gradient: "from-blue-400/20 via-blue-400/10 to-transparent",
    border: "hover:border-blue-500/40",
  },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com/weecommerce.id", icon: Camera },
  { label: "LinkedIn", href: "https://linkedin.com/company/weecommerce", icon: Globe },
  { label: "Threads", href: "https://threads.net/@weecommerce.id", icon: MessageSquare },
  { label: "X / Twitter", href: "#", icon: Hash },
];

export default function ContactPage() {
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  return (
    <div className="section-container py-20 md:py-28">
      {/* Header */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Send className="size-6" />
        </div>
        <h1 className="mb-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Let&apos;s Build Something That Works
        </h1>
        <p className="text-lg text-muted-foreground">
          Every project starts with a conversation. Choose the channel that works best for you.
        </p>
      </div>

      {/* Main CTA channels */}
      <div className="mx-auto mb-16 max-w-5xl space-y-4">
        {channels.map((ch) => (
          <div key={ch.id} className="rounded-2xl border border-border bg-card transition-all">
            {/* Channel header — always visible */}
            <button
              onClick={() => setExpandedChannel(expandedChannel === ch.id ? null : ch.id)}
              className={`group flex w-full items-center gap-5 rounded-2xl p-6 text-left transition-all ${ch.border} ${expandedChannel === ch.id ? 'rounded-b-none border-b border-border' : ''}`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 ${expandedChannel === ch.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                <ch.icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-base font-semibold md:text-lg">{ch.title}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">{ch.desc}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {ch.id !== 'call' && ch.href && (
                  <a
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    {ch.action}
                    <ArrowRight className="size-3" />
                  </a>
                )}
                <ChevronDown className={`size-5 text-muted-foreground transition-transform duration-300 ${expandedChannel === ch.id ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Expanded content: only for Book a Call */}
            {expandedChannel === 'call' && (
              <div className="border-t border-border p-6">
                <BookingForm />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-auto mb-12 flex max-w-md items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or find us on</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Social Media Box Buttons */}
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-hover flex items-center justify-center gap-2 rounded-2xl border border-border p-5 text-center transition-all"
          >
            <span className="text-primary/80"><s.icon className="size-4" /></span>
            <span className="text-sm font-medium">{s.label}</span>
          </a>
        ))}
      </div>

      {/* Bottom info */}
      <div className="mx-auto mt-16 max-w-xl text-center">
        <div className="rounded-2xl border border-border/50 bg-card/50 p-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Response time:</span> within 24 business hours
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Indonesia — Remote-first, globally available
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>30-min discovery call</span>
            <span className="text-border">·</span>
            <span>Proposal within 48h</span>
            <span className="text-border">·</span>
            <span>Milestone-based payment</span>
          </div>
        </div>
      </div>
    </div>
  );
}
