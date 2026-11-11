"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon, Reveal, Button } from "./ui";
import { scrollToEl } from "../lib/gsap";
import { BRAND, CLIENTS, SUGGESTIONS } from "./data";

/* ================= AI CHAT ================= */
function Bubble({ m, tick }) {
  const [n, setN] = useState(m.fresh ? 0 : m.content.length);
  useEffect(() => {
    if (!m.fresh) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setN(i);
      tick();
      if (i >= m.content.length) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  }, []); // eslint-disable-line
  return <div className={"bub " + m.role}>{m.content.slice(0, n)}</div>;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    { role: "assistant", content: `Hi, I'm the ${BRAND} AI assistant. Ask me about our services, how we work, or how AI can improve your website.` },
  ]);
  const body = useRef(null);
  const field = useRef(null);
  const toBottom = () => body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" });

  useEffect(() => { toBottom(); }, [msgs, busy, open]);
  useEffect(() => {
    if (open) setTimeout(() => field.current?.focus(), 250);
    const k = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  async function send(text) {
    const t = (text ?? input).trim();
    if (!t || busy) return;
    const history = [...msgs.map(({ role, content }) => ({ role, content })), { role: "user", content: t }];
    setMsgs((m) => [...m.map((x) => ({ ...x, fresh: false })), { role: "user", content: t }]);
    setInput("");
    setBusy(true);
    let reply = "Connection problem. Please try again in a moment.";
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      reply = (await r.json()).reply || reply;
    } catch (e) {}
    setMsgs((m) => [...m, { role: "assistant", content: reply, fresh: true }]);
    setBusy(false);
  }

  return (
    <>
      <button className="ask-pill" onClick={() => setOpen(true)} aria-label="Open AI assistant">
        <span className="ask-spark"><Icon name="ai" size={14} /></span>
        <span className="ask-text">Ask AI about our services...</span>
        <span className="ask-badge">AI</span>
      </button>

      {mounted && createPortal(
      <div className={"chat" + (open ? " open" : "")} role="dialog" aria-label="AI assistant" aria-hidden={!open}>
        <div className="chat-head">
          <span className="orb"><Icon name="ai" size={18} /></span>
          <div className="chat-title"><b>{BRAND} AI</b><small><i className="dot" /> Online · replies instantly</small></div>
          <button className="chat-x" onClick={() => setOpen(false)} aria-label="Close chat"><Icon name="close" size={16} /></button>
        </div>
        <div className="chat-body" ref={body}>
          {msgs.map((m, i) => <Bubble key={i} m={m} tick={toBottom} />)}
          {busy && <div className="bub assistant typing"><i /><i /><i /></div>}
          {msgs.length === 1 && (
            <div className="chips">{SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}</div>
          )}
        </div>
        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input ref={field} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about services, process, AI..." maxLength={400} aria-label="Your message" />
          <button type="submit" className="send" disabled={busy || !input.trim()} aria-label="Send"><Icon name="send" size={16} /></button>
        </form>
        <p className="chat-note">AI can make mistakes. For quotes, use the project form below.</p>
      </div>,
        document.body
      )}
    </>
  );
}

/* ================= CLIENT LOGOS ================= */
function tone(img) {
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 24;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0, 24, 24);
    const d = x.getImageData(0, 0, 24, 24).data;
    let sum = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 60) { sum += (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255; n++; }
    return n && sum / n > 0.72 ? "dark" : "light"; // light logo -> dark card
  } catch (e) { return null; }
}

export function ClientLogo({ c, variant = "chip" }) {
  const fav = `https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`;
  const list = (variant === "avatar" ? [`/clients/${c.key}.png`, c.icon, c.logo, fav] : [`/clients/${c.key}.png`, c.logo, fav]).filter(Boolean);
  const [i, setI] = useState(0);
  const [t, setT] = useState(c.tile || "light");
  const ref = useRef(null);
  const src = list[i];
  const failed = i >= list.length;
  const isFav = src === fav;
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setI((n) => n + 1);
  }, [i]);
  const img = !failed && (
    <img
      ref={ref} key={i} src={src} alt={variant === "chip" && !isFav ? c.name : ""} loading="eager"
      onError={() => setI((n) => n + 1)}
      onLoad={(e) => { if (!c.tile && src.startsWith("/")) { const r = tone(e.currentTarget); if (r) setT(r); } }}
    />
  );
  if (variant === "avatar") return <span className={"av " + t} title={c.name}>{img || c.name[0]}</span>;
  return (
    <span className={"logo-chip " + t + (isFav || failed ? " fallback" : "")} title={c.name}>
      {img}{(isFav || failed) && <b>{c.name}</b>}
    </span>
  );
}

/* white logo strip used in the hero (right to left, pauses on hover) */
function StripLogo({ c }) {
  const fav = `https://www.google.com/s2/favicons?domain=${c.domain}&sz=128`;
  const list = [c.tile !== "dark" && `/clients/${c.key}.png`, c.tile === "dark" ? c.icon : c.logo, c.icon, fav].filter(Boolean);
  const [i, setI] = useState(0);
  const ref = useRef(null);
  const src = list[i];
  const named = !src || src === c.icon || src === fav;
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setI((n) => n + 1);
  }, [i]);
  return (
    <span className="mq-item" title={c.name}>
      {src && <img ref={ref} key={i} src={src} alt={named ? "" : c.name} onError={() => setI((n) => n + 1)} />}
      {named && <b>{c.name}</b>}
    </span>
  );
}

export function ClientStrip() {
  const list = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];
  return (
    <div className="strip-logos" aria-label="Our clients">
      <div className="strip-track">{list.map((c, n) => <StripLogo key={n} c={c} />)}</div>
    </div>
  );
}

/* ================= NAV (mobile menu) ================= */
export function NavMenu({ links }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => window.innerWidth > 900 && setOpen(false);
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return (
    <>
      <nav className={"nav-links" + (open ? " open" : "")}>
        {links.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)}>{l}</a>)}
      </nav>
      <button className={"burger" + (open ? " open" : "")} onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}><i /><i /></button>
    </>
  );
}

function Photo({ src, fallback }) {
  const [cur, setCur] = useState(src || fallback);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0 && cur !== fallback) setCur(fallback);
  }, [cur]); // eslint-disable-line
  return <img ref={ref} src={cur} alt="" loading="lazy" onError={() => cur !== fallback && setCur(fallback)} />;
}

/* ================= SERVICES: scroll-driven slider with image cards ================= */
export function Services({ items }) {
  const wrap = useRef(null);
  const track = useRef(null);
  const manual = useRef(0);
  const apply = useRef(() => {});

  useEffect(() => {
    apply.current = () => {
      const w = wrap.current, t = track.current;
      if (!w || !t) return;
      const max = Math.max(0, t.scrollWidth - w.clientWidth);
      const r = w.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
      manual.current = Math.min(max, Math.max(-max, manual.current));
      const x = Math.min(0, Math.max(-max, -max * (1 - p) + manual.current));
      t.style.transform = `translate3d(${x}px,0,0)`;
    };
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply.current); };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  const nudge = (dir) => {
    const card = track.current?.firstElementChild;
    manual.current += dir * ((card ? card.offsetWidth : 300) + 24);
    apply.current();
  };

  return (
    <>
      <div className="sec-head">
        <Reveal as="h2" className="sec-title">OUR SERVICE</Reveal>
        <div className="arrows">
          <button className="circle-btn" onClick={() => nudge(1)} aria-label="Previous"><Icon name="left" size={16} /></button>
          <button className="circle-btn" onClick={() => nudge(-1)} aria-label="Next"><Icon name="right" size={16} /></button>
        </div>
      </div>
      <div className="s-wrap" ref={wrap}>
        <div className="s-track" ref={track}>
          {items.map((s) => (
            <article className="scard" key={s.title} tabIndex={0}>
              <Photo src={s.photo} fallback={s.img} />
              <div className="scard-shade" />
              <span className="icon-circle scard-ic"><Icon name={s.icon} size={18} /></span>
              <div className="scard-info">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

/* ================= LIMITLESS: click right card, left content changes ================= */
export function Explorer({ points }) {
  const [i, setI] = useState(0);
  const p = points[i];
  return (
    <section className="wrap about" id="about">
      <svg className="wave" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 330 C 300 330, 450 220, 760 260 S 1200 330, 1440 250" />
      </svg>
      <div className="about-left" aria-live="polite">
        <div key={i} className="swap">
          <h2 className="big">{p.heading}</h2>
          <hr className="rule2" />
          <p className="muted">{p.text}</p>
          <ul className="ticks">{p.bullets.map((b) => <li key={b}><Icon name="check" size={14} />{b}</li>)}</ul>
        </div>
      </div>
      <div className="about-right">
        {points.map((q, n) => (
          <Reveal key={q.title} delay={n * 90}>
            <button className={"pt-card" + (n === i ? " active" : "")} onClick={() => setI(n)} aria-pressed={n === i}>
              <div>
                <p>{q.short}</p>
                <strong>{q.title}</strong>
              </div>
              <span className="icon-circle lg"><Icon name={q.icon} size={22} /></span>
            </button>
          </Reveal>
        ))}
        <p className="hint">Select a card to explore</p>
      </div>
    </section>
  );
}

/* ================= DIVE: interactive Transformation Lab ================= */
const TOG = [
  { k: "design", icon: "layout", t: "Modern redesign", d: "Clean layout and bold typography" },
  { k: "speed", icon: "bolt", t: "Speed boost", d: "Optimized code and images" },
  { k: "ai", icon: "ai", t: "AI chatbot", d: "Answers visitors 24/7" },
  { k: "anim", icon: "refresh", t: "Smooth animations", d: "Scroll and hover effects" },
  { k: "dark", icon: "moon", t: "Dark mode", d: "A theme that fits your brand" },
];
const OFF = { design: false, speed: false, ai: false, anim: false, dark: false };

function useCount(target) {
  const [v, setV] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    let raf; const from = cur.current, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 900);
      cur.current = from + (target - from) * (1 - Math.pow(1 - p, 3));
      setV(cur.current);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

export function Lab() {
  const [on, setOn] = useState(OFF);
  const timers = useRef([]);
  const started = useRef(false);
  const box = useRef(null);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const run = () => {
    clear();
    setOn(OFF);
    TOG.forEach((x, n) => timers.current.push(setTimeout(() => setOn((o) => ({ ...o, [x.k]: true })), 800 + n * 1100)));
  };
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started.current) { started.current = true; run(); } }, { threshold: 0.35 });
    box.current && io.observe(box.current);
    return () => { io.disconnect(); clear(); };
  }, []); // eslint-disable-line
  const toggle = (k) => { clear(); setOn((o) => ({ ...o, [k]: !o[k] })); };

  const score = useCount(on.speed ? 98 : 41);
  const load = useCount(on.speed ? 9 : 48) / 10;
  const count = Object.values(on).filter(Boolean).length;
  const level = useCount(count * 20);
  const done = count === TOG.length;

  return (
    <>
      <div className="dive-copy">
        <Reveal as="h2" className="dive-title2">DIVE INTO THE FUTURE</Reveal>
        <Reveal as="p" className="muted" delay={120}>Switch on upgrades and watch a typical outdated website transform live: design, speed, AI and motion.</Reveal>
        <Reveal className="switches" delay={180}>
          {TOG.map((x) => (
            <button key={x.k} role="switch" aria-checked={on[x.k]} className={"sw" + (on[x.k] ? " on" : "")} onClick={() => toggle(x.k)}>
              <span className="icon-circle"><Icon name={x.icon} size={16} /></span>
              <span className="sw-t"><b>{x.t}</b><small>{x.d}</small></span>
              <i className="knob" />
            </button>
          ))}
        </Reveal>
        <button className="replay" onClick={run}>Replay demo</button>
      </div>

      <Reveal className="dive-demo" delay={150}>
        <div ref={box} className={"lab-screen " + (on.dark ? "dark " : "") + (on.anim ? "anim " : "") + (done ? "done" : "")}>
          <div className="lab-chrome"><i /><i /><i /><span>yourbusiness.com</span><b>{load.toFixed(1)}s</b></div>
          <div className="lab-view">
            <div className={"layer tf-old-wrap" + (on.design ? "" : " show")}>
              <div className="tf-old">
                <div className="o-top">WELCOME TO OUR WEBSITE!!!</div>
                <div className="o-body">
                  <div className="o-side"><a>Home</a><a>About Us</a><a>Products</a><a>Gallery</a><a>Contact Us</a><small>Best viewed in IE6</small></div>
                  <div className="o-main">
                    <h5>Welcome!</h5>
                    <p>We are a company that does many things. Please read the text below to learn more about us and what we do for our customers since 1999.</p>
                    <p className="o-red">CLICK HERE!!! NEW!!!</p>
                    <small>You are visitor no. 000124</small>
                  </div>
                </div>
              </div>
            </div>
            <div className={"layer" + (on.design ? " show" : "")}>
              <div className="tf-new">
                <div className="n-nav"><b>Brand</b><span>Home</span><span>Services</span><span>Contact</span><em>Get started</em></div>
                <h4>Grow faster<br />online.</h4>
                <p>Fast, modern and AI-ready.</p>
                <div className="n-btns"><i>Start now</i><u>Learn more</u></div>
                <div className="n-cards"><span><b>{Math.round(score)}</b>Speed score</span><span><b>100%</b>Responsive</span><span><b>{on.ai ? "24/7" : "9-5"}</b>Support</span></div>
              </div>
            </div>
            {on.ai && (
              <div className="lab-chat">
                <div className="lc u">Do you build AI chatbots?</div>
                <div className="lc a">Yes! Tell me about your site and I will suggest the best setup.</div>
                <div className="lc t"><i /><i /><i /></div>
              </div>
            )}
          </div>
        </div>
        <div className="lab-metrics">
          <div><small>Speed score</small><b>{Math.round(score)}</b><span><i style={{ width: score + "%", background: `hsl(${Math.min(120, score * 1.25)} 70% 55%)` }} /></span></div>
          <div><small>Load time</small><b>{load.toFixed(1)}s</b><span><i style={{ width: Math.min(100, load * 20) + "%", background: "#8a8a92" }} /></span></div>
          <div><small>Modernization</small><b>{count}/{TOG.length}</b><span><i style={{ width: level + "%", background: "#fff" }} /></span></div>
        </div>
        <p className="lab-note">{done ? "Fully transformed. This is what we build for you." : "Illustrative demo. Tap the switches to explore."}</p>
      </Reveal>
    </>
  );
}

/* ================= PLANNER ================= */
const TYPES = [
  ["A new website", "Frontend Development"],
  ["Redesign of my current site", "Website Transformation"],
  ["AI chatbot or automation", "AI Integration & Automation"],
  ["A custom web app", "Full Stack Development"],
  ["Ongoing website support", "Website Maintenance"],
];
const ADDONS = ["AI chatbot", "Lead and contact forms", "Admin dashboard", "Online payments", "Blog or CMS", "SEO basics", "Speed optimization", "Multi-language"];
const TIMES = ["As soon as possible", "Within a month", "1 to 3 months", "Flexible"];
const SCOPE = ["Choose a project type", "Focused", "Standard", "Extended"];

export function Planner() {
  const [type, setType] = useState(null);
  const [adds, setAdds] = useState([]);
  const [time, setTime] = useState(null);
  const scope = type === null ? 0 : adds.length <= 1 ? 1 : adds.length <= 3 ? 2 : 3;
  const flip = (a) => setAdds((l) => (l.includes(a) ? l.filter((x) => x !== a) : [...l, a]));
  const brief = type === null ? "" :
    `Hi, I am interested in: ${TYPES[type][0]}.\nAdd-ons: ${adds.length ? adds.join(", ") : "none yet"}.\nTimeline: ${time === null ? "not decided" : TIMES[time]}.\n\nSome details about my project: `;
  const send = () => {
    window.dispatchEvent(new CustomEvent("prefill", { detail: { service: TYPES[type][1], message: brief } }));
    scrollToEl("#contact");
  };
  return (
    <div className="plan">
      <div className="plan-steps">
        <Reveal className="pstep">
          <h3><span>1</span>What do you need?</h3>
          <div className="opts">{TYPES.map((t, n) => <button key={t[0]} className={"opt" + (type === n ? " on" : "")} onClick={() => setType(n)}>{t[0]}</button>)}</div>
        </Reveal>
        <Reveal className="pstep" delay={100}>
          <h3><span>2</span>Add-ons <small>choose any</small></h3>
          <div className="opts">{ADDONS.map((a) => <button key={a} className={"opt" + (adds.includes(a) ? " on" : "")} onClick={() => flip(a)}>{adds.includes(a) && <Icon name="check" size={12} />}{a}</button>)}</div>
        </Reveal>
        <Reveal className="pstep" delay={200}>
          <h3><span>3</span>Timeline</h3>
          <div className="opts">{TIMES.map((t, n) => <button key={t} className={"opt" + (time === n ? " on" : "")} onClick={() => setTime(n)}>{t}</button>)}</div>
        </Reveal>
      </div>
      <Reveal className="brief" delay={150}>
        <p className="brief-k">YOUR PROJECT BRIEF</p>
        <ul>
          <li><small>Project</small><b>{type === null ? "Not selected" : TYPES[type][0]}</b></li>
          <li><small>Service</small><b>{type === null ? "-" : TYPES[type][1]}</b></li>
          <li><small>Add-ons</small><b>{adds.length ? adds.join(", ") : "None selected"}</b></li>
          <li><small>Timeline</small><b>{time === null ? "Not decided" : TIMES[time]}</b></li>
        </ul>
        <div className="scope"><small>Estimated scope: <b>{SCOPE[scope]}</b></small><span>{[1, 2, 3].map((n) => <i key={n} className={scope >= n ? "on" : ""} />)}</span></div>
        <Button variant="light" onClick={() => type !== null && send()} disabled={type === null}>Send this brief</Button>
        <p className="brief-note">{type === null ? "Choose a project type on the left to continue." : "Your choices fill in the contact form below. Nothing is sent until you submit it."}</p>
      </Reveal>
    </div>
  );
}
