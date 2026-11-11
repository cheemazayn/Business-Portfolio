import { BRAND, HERO_IMAGE, HEADLINES, NAV, SERVICES, POINTS } from "../components/data";
import { Icon, Reveal, Button, Typing, ContactForm } from "../components/ui";
import { ChatWidget, ClientStrip, NavMenu, Services, Explorer, Lab, Planner } from "../components/extra";
import Motion from "../components/motion";

export default function Home() {
  return (
    <main>
      <Motion />
      {/* ================= HERO ================= */}
      <section className="hero" id="home">
        <svg className="hero-track" viewBox="0 0 1440 700" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 520 H640 L760 400 H1440" />
        </svg>
        <div className="wrap">
          <header className="nav">
            <a href="#home" className="brand"><Icon name="cube" size={22} /> {BRAND}</a>
            <NavMenu links={NAV} />
            <ChatWidget />
          </header>

          <div className="hero-body">
            <div className="hero-copy">
              <p className="kicker">FUTURISTIC</p>
              <div className="title-wrap">
                <span className="num">05</span>
                <Typing headlines={HEADLINES} />
              </div>
              <p className="hero-sub">Full stack websites, modern redesigns, AI integration and ongoing maintenance, delivered end to end.</p>
              <div className="cta-row">
                <Button href="#contact" variant="dark">Get Started</Button>
              </div>
            </div>
            <div className="hero-art">
              <img src={HERO_IMAGE} alt="Modern website design and development" />
            </div>
          </div>

          <div className="hero-foot">
            <div className="trusted">
              <span>Trusted by Clients</span>
              <ClientStrip />
            </div>
            <span className="badge-circle">8g</span>
            <p className="hero-note">From a single landing page to a full platform, we build, transform and maintain websites that look sharp and perform fast.</p>
          </div>
        </div>
      </section>

      {/* ================= DARK ================= */}
      <div className="dark-wrap">
        <div className="dark">
          <div className="strip"><span className="strip-line" /></div>
          <svg className="arc" viewBox="0 0 400 60" aria-hidden="true"><path d="M20 40 C 120 10, 280 10, 380 40" /></svg>

          <section className="wrap services" id="services"><Services items={SERVICES} /></section>

          <Explorer points={POINTS} />

          {/* ---- Dive into the future: interactive before/after ---- */}
          <section className="wrap dive2" id="transform">
            <div className="dive-card">
              <div className="dive-lines" aria-hidden="true">
                <svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
                  {Array.from({ length: 16 }).map((_, k) => <path key={k} d={`M${k * 56 - 60} 0 L${k * 56 + 180} 400`} stroke="#fff" strokeOpacity=".045" />)}
                  <circle cx="120" cy="330" r="170" stroke="#fff" strokeOpacity=".08" fill="none" />
                  <circle cx="120" cy="330" r="110" stroke="#fff" strokeOpacity=".06" fill="none" />
                </svg>
              </div>
              <Lab />
            </div>
          </section>

          {/* ---- Plan your project ---- */}
          <section className="wrap planner" id="plan">
            <div className="sec-head">
              <Reveal as="h2" className="sec-title">PLAN YOUR PROJECT</Reveal>
            </div>
            <Planner />
          </section>

          {/* ---- Contact ---- */}
          <section className="wrap contact" id="contact">
            <Reveal className="contact-copy">
              <h2 className="sec-title">START YOUR PROJECT</h2>
              <p className="muted">Tell us what you need. Whether it is a new build, a redesign, an AI feature or maintenance, we will reply with next steps.</p>
            </Reveal>
            <Reveal delay={120}><ContactForm services={SERVICES.map((s) => s.title)} /></Reveal>
          </section>

          <footer className="site-foot">
            <p>&copy; {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
