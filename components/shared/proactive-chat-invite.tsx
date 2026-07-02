"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, X } from "lucide-react";
import { track } from "@/lib/analytics/track";

const SESSION_KEY = "nv-chat-invited";
const SCROLL_THRESHOLD = 0.7;

interface ProactiveChatInviteProps {
  text: string;
  ctaLabel: string;
  closeLabel: string;
}

/**
 * Invitación proactiva al chat (CRO §1.3) — solo mobile/tablet (<lg):
 * en desktop el ScrollBeam ya invita al 55% del scroll.
 *
 * Reglas anti-molestia: máx. 1 vez por sesión (sessionStorage), no aparece
 * en /contacto, y el cierre se respeta. Abre el chat Dapta si está montado;
 * si no, navega a /contacto (el CTA nunca queda muerto).
 */
export function ProactiveChatInvite({ text, ctaLabel, closeLabel }: ProactiveChatInviteProps) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [show, setShow] = useState(false);
  const firedRef = useRef(false);

  const onContactPage = /\/(contacto|contact)(\/|$)/.test(pathname);

  useEffect(() => {
    if (onContactPage || firedRef.current) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      /* noop */
    }
    let rafId = 0;
    const check = () => {
      rafId = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (window.scrollY / max > SCROLL_THRESHOLD && !firedRef.current) {
        firedRef.current = true;
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          /* noop */
        }
        setShow(true);
        track("chat_invite", { action: "shown", path: pathname });
        window.removeEventListener("scroll", onScroll);
      }
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [onContactPage, pathname]);

  if (!show || onContactPage) return null;

  const openChat = () => {
    track("chat_invite", { action: "open", path: pathname });
    setShow(false);
    const launcher = document.querySelector<HTMLElement>(
      'button[id*="dapta" i], button[class*="dapta" i], [id*="dapta" i] button',
    );
    if (launcher) {
      launcher.click();
      return;
    }
    router.push(pathname.startsWith("/en") ? "/en/contact" : "/contacto");
  };

  return (
    <div
      role="dialog"
      aria-label={text}
      className="glass-elevated fixed bottom-24 right-4 z-40 flex max-w-[260px] items-start gap-2.5 rounded-xl p-3.5 lg:hidden"
    >
      <div className="flex-1">
        <p className="text-sm leading-snug text-text-100">{text}</p>
        <button
          type="button"
          onClick={openChat}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:border-primary/60"
        >
          <MessageCircle size={12} aria-hidden="true" />
          {ctaLabel}
        </button>
      </div>
      <button
        type="button"
        aria-label={closeLabel}
        onClick={() => {
          setShow(false);
          track("chat_invite", { action: "dismiss", path: pathname });
        }}
        className="shrink-0 text-text-40 hover:text-text-100"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
