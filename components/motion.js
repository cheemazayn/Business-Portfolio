"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger, scrollToEl } from "../lib/gsap";

const BOUNCE = ".opt,.sw,.pt-card,.circle-btn,.chips button,.play2,.send,.replay,.chat-x,.ask-pill,.burger";

export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* anchors: smooth GSAP scroll */
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a && !e.defaultPrevented) {
        const h = a.getAttribute("href");
        if (h.length > 1 && document.querySelector(h)) { e.preventDefault(); scrollToEl(h); }
      }
      if (reduce) return;
      /* click ring */
      const d = document.createElement("span");
      d.className = "click-ring";
      d.style.left = e.clientX + "px";
      d.style.top = e.clientY + "px";
      document.body.appendChild(d);
      gsap.fromTo(d, { scale: 0.1, opacity: 0.9 }, { scale: 1, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => d.remove() });
      /* elastic bounce on interactive controls */
      const t = e.target.closest && e.target.closest(BOUNCE);
      if (t) gsap.fromTo(t, { scale: 0.92 }, { scale: 1, duration: 0.8, ease: "elastic.out(1,0.45)", clearProps: "transform", overwrite: "auto" });
    };
    document.addEventListener("click", onClick);

    if (reduce) return () => document.removeEventListener("click", onClick);

    const ctx = gsap.context(() => {
      /* hero intro */
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".nav", { y: -30, autoAlpha: 0, duration: 0.9 })
        .from(".kicker,.num", { x: -20, autoAlpha: 0, duration: 0.7 }, "-=0.5")
        .from(".title-wrap", { y: 40, autoAlpha: 0, duration: 1 }, "-=0.5")
        .from(".hero-sub", { y: 24, autoAlpha: 0, duration: 0.8 }, "-=0.6")
        .from(".cta-row", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-art", { y: 50, scale: 0.92, autoAlpha: 0, duration: 1.2 }, "-=1.1")
        .from(".hero-track", { autoAlpha: 0, duration: 1.4 }, "-=1.2")
        .from(".hero-foot > *", { y: 24, autoAlpha: 0, stagger: 0.12, duration: 0.8 }, "-=0.7");

      /* hero image parallax */
      gsap.to(".hero-art", { yPercent: -7, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

      /* service cards stagger in */
      gsap.from(".scard", { y: 70, scale: 0.94, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".s-wrap", start: "top 88%", once: true } });

      /* lab screen tilts into place */
      gsap.fromTo(".lab-screen", { rotateX: 9, y: 30 }, { rotateX: 0, y: 0, ease: "none", scrollTrigger: { trigger: ".lab-screen", start: "top 98%", end: "top 45%", scrub: 0.6 } });

      /* decorative parallax */
      gsap.to(".dive-lines", { y: -70, ease: "none", scrollTrigger: { trigger: ".dive-card", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.to(".wave", { y: -40, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true } });


      /* scroll progress */
      gsap.to(".progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(document.body);
    document.fonts && document.fonts.ready.then(refresh);

    return () => {
      ro.disconnect();
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return <div className="progress" aria-hidden="true" />;
}
