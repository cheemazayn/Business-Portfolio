import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function scrollToEl(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  gsap.to(window, { duration: 1.1, ease: "power3.inOut", scrollTo: { y: el, autoKill: true } });
}

export { gsap, ScrollTrigger };
