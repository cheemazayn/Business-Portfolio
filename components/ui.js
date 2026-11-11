"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, scrollToEl } from "../lib/gsap";

/* ---------- icons ---------- */
const P = {
  stack: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17.5l9 5 9-5",
  layout: "M4 5h16v14H4zM4 10h16M10 10v9",
  server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01",
  refresh: "M20 11a8 8 0 00-14-4L4 9M4 4v5h5M4 13a8 8 0 0014 4l2-2M20 20v-5h-5",
  ai: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  wrench: "M14.7 6.3a4 4 0 005 5L21 12.6 12.6 21a2.1 2.1 0 01-3-3L18 9.6M14.7 6.3L17 4M3 21l3-3",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M9 12l2 2 4-4",
  send: "M3 11l18-8-8 18-2-8z",
  close: "M6 6l12 12M18 6L6 18",
  check: "M5 12l5 5 10-11",
  pause: "M8 5v14M16 5v14",
  moon: "M21 12.8A9 9 0 1111.2 3a7 7 0 009.800 9.800z",
  search: "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.5-4.5",
  left: "M15 5l-7 7 7 7",
  right: "M9 5l7 7-7 7",
  play: "M8 5v14l11-7z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  cube: "M12 2l9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10",
  github: "M9 19c-4 1.5-4-2-6-2m12 4v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.700 5.700 5.500 6-.6.6-.6 1.200-.5 2V21",
  linkedin: "M4 9h4v11H4zM6 3.500a2 2 0 110 4 2 2 0 010-4zM10 9h3.800v1.600c.6-1 1.900-1.900 3.800-1.900 3.600 0 4.400 2.300 4.400 5.400V20h-4v-5.200c0-1.300 0-2.800-1.800-2.800s-2.200 1.300-2.200 2.700V20h-4z",
  insta: "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM12 8a4 4 0 100 8 4 4 0 000-8zM17.500 6.500h.01",
  x: "M4 4l16 16M20 4L4 20",
};
export function Icon({ name, size = 20, fill = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name]} />
    </svg>
  );
}

export function Logo({ dark = false, label = "Logoipsum" }) {
  return (
    <span className={"logo-dummy" + (dark ? " on-dark" : "")}>
      <Icon name="cube" size={20} /> {label}
    </span>
  );
}

/* ---------- scroll reveal (GSAP) ---------- */
export function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { gsap.set(el, { autoAlpha: 1 }); return; }
    const hr = el.tagName === "HR";
    gsap.set(el, hr ? { autoAlpha: 0, scaleX: 0, transformOrigin: "left center" } : { autoAlpha: 0, y: 46 });
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      gsap.to(el, { autoAlpha: 1, y: 0, scaleX: 1, duration: 1.05, delay: delay / 1000, ease: "power3.out", clearProps: "transform" });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => { io.disconnect(); gsap.killTweensOf(el); };
  }, []); // eslint-disable-line
  return <Tag ref={ref} className={"reveal " + className} {...rest}>{children}</Tag>;
}

/* ---------- animated button ---------- */
export function Button({ children, href, variant = "dark", onClick, type = "button", disabled, loading }) {
  const [ripples, setRipples] = useState([]);
  const [pressed, setPressed] = useState(false);
  const handle = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((l) => [...l, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setPressed(true);
    setTimeout(() => setPressed(false), 450);
    setTimeout(() => setRipples((l) => l.filter((x) => x.id !== id)), 700);
    if (href && href.startsWith("#")) {
      e.preventDefault();
      scrollToEl(href);
    }
    onClick && onClick(e);
  };
  const cls = `btn btn-${variant}${pressed ? " pressed" : ""}${loading ? " loading" : ""}`;
  const inner = (
    <>
      <span className="btn-label">{children}</span>
      <span className="btn-arrow"><Icon name="arrow" size={16} /></span>
      {ripples.map((r) => (
        <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
      ))}
    </>
  );
  return href ? (
    <a href={href} className={cls} onClick={handle}>{inner}</a>
  ) : (
    <button type={type} className={cls} onClick={handle} disabled={disabled}>{inner}</button>
  );
}

/* ---------- typing headline (two headlines, one replaces the other) ---------- */
export function Typing({ headlines }) {
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState("typing"); // typing | hold | erasing
  const full = headlines[idx].join("\n");

  useEffect(() => {
    let t;
    if (phase === "typing") {
      if (count < full.length) t = setTimeout(() => setCount(count + 1), 55);
      else t = setTimeout(() => setPhase("erasing"), 2200); // hold ~2s, then next replaces it
    } else if (phase === "erasing") {
      if (count > 0) t = setTimeout(() => setCount(count - 1), 22);
      else {
        setIdx((idx + 1) % headlines.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(t);
  }, [count, phase, full, idx, headlines.length]);

  const [l1, l2 = ""] = full.slice(0, count).split("\n");
  return (
    <h1 className="hero-title" aria-label={headlines[idx].join(" ")}>
      <span className="ht-line">{l1 || "\u00A0"}{count <= headlines[idx][0].length && <i className="caret" />}</span>
      <span className="ht-line">{l2 || "\u00A0"}{count > headlines[idx][0].length && <i className="caret" />}</span>
    </h1>
  );
}

/* ---------- services carousel ---------- */
export function Carousel({ items }) {
  const [i, setI] = useState(0);
  const [per, setPer] = useState(3);
  useEffect(() => {
    const f = () => setPer(window.innerWidth < 700 ? 1 : window.innerWidth < 1000 ? 2 : 3);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  const max = Math.max(0, items.length - per);
  const idx = Math.min(i, max);
  return (
    <>
      <div className="sec-head">
        <Reveal as="h2" className="sec-title">OUR SERVICE</Reveal>
        <div className="arrows">
          <button className="circle-btn" onClick={() => setI(Math.max(0, idx - 1))} disabled={idx === 0} aria-label="Previous"><Icon name="left" size={16} /></button>
          <button className="circle-btn" onClick={() => setI(Math.min(max, idx + 1))} disabled={idx === max} aria-label="Next"><Icon name="right" size={16} /></button>
        </div>
      </div>
      <div className="track-wrap">
        <div className="track" style={{ "--per": per, transform: `translateX(calc(${idx} * -1 * ((100% + 24px) / ${per})))` }}>
          {items.map((s) => (
            <article className="card" key={s.title}>
              <span className="icon-circle"><Icon name={s.icon} size={20} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <a href="#contact" className="learn" onClick={(e) => { e.preventDefault(); scrollToEl("#contact"); }}>Learn More</a>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- contact form ---------- */
export function ContactForm({ services }) {
  const [state, setState] = useState({ status: "idle", msg: "" });
  const formRef = useRef(null);
  useEffect(() => {
    const h = (e) => {
      const f = formRef.current;
      if (!f) return;
      if (e.detail?.service) f.elements.service.value = e.detail.service;
      f.elements.message.value = e.detail?.message || "";
      setTimeout(() => f.elements.message.focus({ preventScroll: true }), 600);
    };
    window.addEventListener("prefill", h);
    return () => window.removeEventListener("prefill", h);
  }, []);
  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setState({ status: "sending", msg: "" });
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      form.reset();
      setState({ status: "done", msg: "Message sent. We will get back to you shortly." });
    } catch (err) {
      setState({ status: "error", msg: err.message || "Something went wrong. Please try again." });
    }
  }
  return (
    <form className="form" ref={formRef} onSubmit={submit}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <div className="row">
        <label>Name<input name="name" required placeholder="Your name" /></label>
        <label>Email<input name="email" type="email" required placeholder="you@company.com" /></label>
      </div>
      <label>Service
        <select name="service" defaultValue="">
          <option value="" disabled>Select a service</option>
          {services.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label>Project details<textarea name="message" rows={5} required placeholder="Tell us about your website or idea" /></label>
      <div className="form-foot">
        <Button type="submit" variant="light" loading={state.status === "sending"} disabled={state.status === "sending"}>
          {state.status === "sending" ? "Sending…" : state.status === "done" ? "Sent" : "Send Message"}
        </Button>
        {state.msg && <p className={"form-msg " + state.status} role="status">{state.msg}</p>}
      </div>
    </form>
  );
}
