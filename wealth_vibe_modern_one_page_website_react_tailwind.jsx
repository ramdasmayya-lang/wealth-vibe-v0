import React, { useEffect, useMemo, useState } from "react";

/**
 * Wealth Vibe – One‑page site (no Tailwind, no external UI libs)
 * -------------------------------------------------------------
 * Why this rewrite?
 * The previous version relied on Tailwind-on-the-fly and shadcn/ui. In this sandbox,
 * loading Tailwind's WASM (tailwindcss_oxide) can fail, causing: "Failed to load WASM scanner".
 * To make the canvas preview reliable, this version uses:
 *   • Pure CSS (embedded <style>) instead of Tailwind
 *   • Local, lightweight components instead of shadcn/ui
 *   • Inline SVG icons (no lucide-react import)
 * Result: No dynamic WASM/module fetches, so it should render in restricted environments.
 */

// -------------------------- Utility: Icons (inline SVG) --------------------------
const Icon = ({ name, size = 20 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "phone":
      return (
        <svg {...common}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.78.59 2.64a2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 7 7l.53-1.22a2 2 0 0 1 2.11-.45c.86.27 1.74.47 2.64.59A2 2 0 0 1 22 16.92z"/></svg>
      );
    case "calendar":
      return (
        <svg {...common}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      );
    case "download":
      return (
        <svg {...common}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      );
    case "arrow-right":
      return (
        <svg {...common}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      );
    case "shield":
      return (
        <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      );
    case "piggy":
      return (
        <svg {...common}><path d="M5 11c-1.657 0-3 1.79-3 4s1.343 4 3 4h9c2.761 0 5-2.239 5-5 0-1.359-.547-2.589-1.431-3.479l1.431-1.521-2-1-1 1a7.976 7.976 0 0 0-3-1H8"/><circle cx="8" cy="11" r="1"/></svg>
      );
    case "landmark":
      return (
        <svg {...common}><path d="M2 9l10-5 10 5"/><path d="M4 10h16v10H4z"/><path d="M10 12v6M14 12v6"/></svg>
      );
    case "mail":
      return (
        <svg {...common}><path d="M22 12v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7"/><path d="M22 12V7a2 2 0 0 0-2-2H4A2 2 0 0 0 2 7v5"/><path d="M2 7l10 6L22 7"/></svg>
      );
    case "send":
      return (
        <svg {...common}><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      );
    case "map-pin":
      return (
        <svg {...common}><path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      );
    case "heart-hs":
      return (
        <svg {...common}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
      );
    default:
      return null;
  }
};

// -------------------------- UI Primitives --------------------------
const Card = ({ children, dashed }) => (
  <div className={`card ${dashed ? "card--dashed" : ""}`}>{children}</div>
);
const CardContent = ({ children }) => <div className="card__content">{children}</div>;
const Button = ({ children, href, variant = "primary", onClick, type }) => {
  const Comp = href ? "a" : "button";
  const props = {
    className: `btn btn--${variant}`,
    href,
    onClick,
    type,
  };
  return <Comp {...props}>{children}</Comp>;
};

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`section ${className}`}>{children}</section>
);

const Feature = ({ icon, title, items }) => (
  <Card>
    <CardContent>
      <div className="feature__head">
        <div className="feature__icon"><Icon name={icon} size={22} /></div>
        <h3 className="feature__title">{title}</h3>
      </div>
      <ul className="feature__list">
        {items.map((it, i) => (
          <li key={i} className="feature__item">{it}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// -------------------------- Tests (lightweight) --------------------------
function runTests() {
  const results = [];
  const hasServices = !!document.getElementById("services");
  results.push({ name: "#services section exists", pass: hasServices });
  const hasAbout = !!document.getElementById("about");
  results.push({ name: "#about section exists", pass: hasAbout });
  const hasTestimonials = !!document.getElementById("testimonials");
  results.push({ name: "#testimonials section exists", pass: hasTestimonials });
  const hasFaq = !!document.getElementById("faq");
  results.push({ name: "#faq section exists", pass: hasFaq });
  const hasContact = !!document.getElementById("contact");
  results.push({ name: "#contact section exists", pass: hasContact });
  const phoneLink = document.querySelector('a[href="tel:+14129536415"]');
  results.push({ name: "Phone link is present", pass: !!phoneLink });
  const calendlyLink = Array.from(document.querySelectorAll('a[href]')).some(a => a.href.includes("calendly.com"));
  results.push({ name: "Calendly CTA link present", pass: calendlyLink });
  const featureCards = document.querySelectorAll('.feature__list');
  results.push({ name: "Service features rendered (>=3)", pass: featureCards.length >= 3 });
  return results;
}

const TestsPanel = () => {
  const [tests, setTests] = useState([]);
  useEffect(() => {
    // Run after first paint
    const id = requestAnimationFrame(() => setTests(runTests()));
    return () => cancelAnimationFrame(id);
  }, []);
  const passed = tests.filter(t => t.pass).length;
  const total = tests.length;
  return (
    <div className="tests">
      <div className="tests__header">Smoke Tests: {passed}/{total} passed</div>
      <ul>
        {tests.map((t, i) => (
          <li key={i} className={t.pass ? "tests__ok" : "tests__fail"}>
            {t.pass ? "✓" : "✗"} {t.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

// -------------------------- Main Site --------------------------
export default function WealthVibeSite() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <div className="site">
      {/* Inline CSS to avoid external fetches */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --bg: #ffffff;
          --bg-soft: #fff7ed; /* amber-50 */
          --text: #0f172a;     /* slate-900 */
          --muted: #475569;    /* slate-600 */
          --card: #ffffff;
          --border: #e2e8f0;   /* slate-200 */
          --brand1: #f59e0b;   /* amber-500 */
          --brand2: #f43f5e;   /* rose-500 */
          --shadow: 0 10px 20px rgba(2,8,23,0.06);
          --radius: 16px;
        }
        * { box-sizing: border-box; }
        body { margin: 0; }
        .site { min-height: 100vh; background: linear-gradient(180deg, var(--bg), var(--bg-soft)); color: var(--text); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"; }
        .container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
        .header { position: sticky; top: 0; z-index: 10; background: rgba(255,255,255,0.85); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); }
        .header__row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brand__logo { width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, #f59e0b, #f43f5e); display: grid; place-items: center; color: white; font-weight: 800; }
        .brand__title { font-weight: 800; letter-spacing: -0.3px; }
        .brand__tag { font-size: 12px; color: var(--muted); margin-top: -2px; }
        nav a { font-size: 14px; color: #334155; text-decoration: none; margin: 0 10px; }
        nav a:hover { color: #0f172a; }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 14px; text-decoration: none; border: 1px solid transparent; cursor: pointer; font-weight: 600; }
        .btn--primary { background: #111827; color: white; }
        .btn--secondary { background: white; color: #111827; border-color: var(--border); }
        .section { padding: 64px 0; }
        .hero { display: grid; gap: 24px; grid-template-columns: 1fr; }
        @media (min-width: 1024px) { .hero { grid-template-columns: 1fr 1fr; align-items: center; gap: 40px; } }
        .headline { font-size: 36px; line-height: 1.1; font-weight: 800; }
        @media (min-width: 640px) { .headline { font-size: 48px; } }
        .headline strong { background: linear-gradient(90deg, var(--brand1), var(--brand2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .lead { margin-top: 12px; font-size: 18px; color: #334155; max-width: 48ch; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; }
        .stat { text-align: center; }
        .stat__value { font-size: 28px; font-weight: 800; }
        .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
        .card--dashed { border-style: dashed; }
        .card__content { padding: 24px; }
        .feature__head { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .feature__icon { background: linear-gradient(135deg, #ffedd5, #ffe4e6); padding: 8px; border-radius: 12px; }
        .feature__title { font-size: 18px; font-weight: 700; }
        .feature__list { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
        .feature__item { display: grid; grid-template-columns: 18px 1fr; gap: 8px; color: #334155; }
        .feature__item::before { content: "✔"; color: #0f172a; font-size: 14px; line-height: 1.6; }
        .grid-3 { display: grid; gap: 16px; grid-template-columns: 1fr; }
        .grid-2 { display: grid; gap: 16px; grid-template-columns: 1fr; }
        @media (min-width: 768px) { .grid-3 { grid-template-columns: repeat(3, 1fr); } .grid-2 { grid-template-columns: repeat(2, 1fr); } }
        .vis { position: relative; border-radius: 20px; background: linear-gradient(135deg, #fff1d6, #ffe3ea); padding: 6px; box-shadow: var(--shadow); }
        .vis__inner { border-radius: 14px; background: white; height: 0; padding-bottom: 56.25%; display: grid; place-items: center; color: #64748b; font-weight: 600; }
        .about__bullets { list-style: none; padding: 0; margin: 16px 0 0; display: grid; gap: 10px; }
        .footer { border-top: 1px solid var(--border); background: #fff; margin-top: 48px; }
        .footer__grid { display: grid; gap: 20px; grid-template-columns: 1fr; padding: 32px 0; }
        @media (min-width: 768px) { .footer__grid { grid-template-columns: repeat(3, 1fr); } }
        .muted { color: var(--muted); font-size: 14px; }
        .tests { margin: 24px 0 0; border: 1px solid var(--border); border-radius: 12px; background: #fff; }
        .tests__header { padding: 10px 14px; font-weight: 700; border-bottom: 1px solid var(--border); background: #f8fafc; }
        .tests ul { list-style: none; margin: 0; padding: 10px 14px; display: grid; gap: 6px; }
        .tests__ok { color: #065f46; }
        .tests__fail { color: #b91c1c; }
      `}} />

      {/* Header */}
      <header className="header">
        <div className="container header__row">
          <div className="brand">
            <div className="brand__logo">WV</div>
            <div>
              <div className="brand__title">Wealth Vibe</div>
              <div className="brand__tag">No family left behind</div>
            </div>
          </div>
          <nav>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#testimonials">Results</a>
            <a href="#faq">FAQ</a>
            <a href="#contact">Contact</a>
          </nav>
          <Button href="#contact" variant="primary">
            <Icon name="phone" /> (412) 953‑6415
          </Button>
        </div>
      </header>

      {/* Hero */}
      <Section className="container">
        <div className="hero">
          <div>
            <h1 className="headline">Live with purpose. <strong>Build wealth with clarity.</strong></h1>
            <p className="lead">Personalized protection, savings, and legacy planning for families and entrepreneurs. Creating wealth. Building futures.</p>
            <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
              <Button href="https://calendly.com/your-link" variant="primary">
                <Icon name="calendar" /> Book a Free Consultation
              </Button>
              <Button href="#brochure" variant="secondary">
                <Icon name="download" /> Download Brochure
              </Button>
            </div>
            <div className="stats">
              <div className="stat"><div className="stat__value">40+</div><div className="muted">Families guided</div></div>
              <div className="stat"><div className="stat__value">3</div><div className="muted">Core service pillars</div></div>
              <div className="stat"><div className="stat__value">1:1</div><div className="muted">Tailored strategies</div></div>
            </div>
          </div>
          <div>
            <div className="vis">
              <div className="vis__inner">Your Logo / Visual</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Services */}
      <Section id="services">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2 className="headline" style={{ fontSize: 34 }}>What we do</h2>
            <p className="muted">Simple, transparent strategies across protection, wealth, and legacy.</p>
          </div>
          <div className="grid-3">
            <Feature
              icon="shield"
              title="Protection & Security"
              items={[
                "Notary Services",
                "Term & Mortgage Protection Insurance",
                "Long-Term Care & Social Security Guidance",
                "Visitor Insurance – when family/parents visit the USA",
                "Life Insurance (incl. IUL strategies)",
              ]}
            />
            <Feature
              icon="piggy"
              title="Wealth & Savings"
              items={[
                "Medicare & ACA Health Plans",
                "Kids’ College Savings & Planning",
                "Tax Optimization Strategies",
                "Investment Solutions",
                "Social Security Analysis – find the right start time",
              ]}
            />
            <Feature
              icon="landmark"
              title="Legacy & Planning"
              items={[
                "Estate Planning Essentials (Will & Trust awareness)",
                "Beneficiary reviews & account titling",
                "NetLaw planning package guidance",
                "Coordination with your attorney & CPA",
              ]}
            />
          </div>

          <div className="grid-2" style={{ marginTop: 20 }}>
            <Card dashed>
              <CardContent>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon name="heart-hs" size={28} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 18 }}>Our promise</h3>
                    <p className="muted" style={{ margin: 0 }}>We meet you where you are. Advice first, products second. No pressure—ever.</p>
                  </div>
                  <Button href="#contact" variant="primary"><Icon name="arrow-right" /> Talk to a human</Button>
                </div>
              </CardContent>
            </Card>

            <Card dashed>
              <CardContent>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon name="calendar" size={28} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 18 }}>Free 15‑min clarity call</h3>
                    <p className="muted" style={{ margin: 0 }}>Bring your questions on college funding, IUL, Medicare, or estate basics. Leave with next steps.</p>
                  </div>
                  <Button href="https://calendly.com/your-link" variant="secondary"><Icon name="arrow-right" /> Book now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* About */}
      <Section id="about">
        <div className="container">
          <div className="grid-2" style={{ alignItems: "center" }}>
            <div>
              <h2 className="headline" style={{ fontSize: 34 }}>Why Wealth Vibe?</h2>
              <p className="lead" style={{ marginTop: 12 }}>We’re a boutique financial wellness agency serving families, professionals, and community leaders. Our approach blends education with actionable plans—so you can protect today, grow tomorrow, and preserve your legacy.</p>
              <ul className="about__bullets">
                {["Transparent, client‑first guidance","Integrated view across protection, savings, and legacy","Community‑driven: workshops, youth financial literacy, and more"].map((t, i) => (
                  <li key={i} className="feature__item" style={{ gridTemplateColumns: "18px 1fr" }}>{t}</li>
                ))}
              </ul>
            </div>
            <div>
              <Card>
                <CardContent>
                  <h3 style={{ marginTop: 0 }}>Founder</h3>
                  <p className="muted">Ramdas Mayya — educator, organizer, and coach. Passionate about empowering families with clear, values‑driven money decisions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2 className="headline" style={{ fontSize: 34 }}>Community impact</h2>
            <p className="muted">Real stories from families we’ve guided.</p>
          </div>
          <div className="grid-3">
            {["Straightforward, no‑pressure guidance. We finally organized our insurance and college plan.", "Clear explanations and next steps—made a complex topic simple.", "Thoughtful planning that respects our values and goals."].map((quote, i) => (
              <Card key={i}>
                <CardContent>
                  <p style={{ fontStyle: "italic", color: "#0f172a" }}>“{quote}”</p>
                  <div className="muted" style={{ marginTop: 8 }}>— Pittsburgh Family</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2 className="headline" style={{ fontSize: 34 }}>Questions, meet answers</h2>
          </div>
          <div className="grid-2">
            <Card><CardContent><h3>Do you charge for the first meeting?</h3><p className="muted">No—your initial clarity call is complimentary.</p></CardContent></Card>
            <Card><CardContent><h3>Do I need an attorney for estate basics?</h3><p className="muted">We explain the essentials and options (e.g., NetLaw). For complex needs, we coordinate with your attorney.</p></CardContent></Card>
            <Card><CardContent><h3>Can you help compare IUL vs. Term?</h3><p className="muted">Yes—we outline pros/cons and align coverage with your goals and budget.</p></CardContent></Card>
            <Card><CardContent><h3>Do you offer workshops?</h3><p className="muted">Yes—community sessions on college planning, Medicare, Social Security timing, and more.</p></CardContent></Card>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2 className="headline" style={{ fontSize: 34 }}>Let’s talk</h2>
            <p className="muted">Call, email, or message us—whatever’s easiest for you.</p>
          </div>
          <div className="grid-2">
            <Card>
              <CardContent>
                <form onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gap: 12 }}>
                  <label>
                    <div className="muted" style={{ fontSize: 13 }}>Name</div>
                    <input required placeholder="Your name" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)", padding: "10px 12px" }} />
                  </label>
                  <label>
                    <div className="muted" style={{ fontSize: 13 }}>Email</div>
                    <input type="email" required placeholder="you@example.com" style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)", padding: "10px 12px" }} />
                  </label>
                  <label>
                    <div className="muted" style={{ fontSize: 13 }}>Message</div>
                    <textarea placeholder="How can we help?" rows={5} style={{ width: "100%", borderRadius: 12, border: "1px solid var(--border)", padding: "10px 12px" }} />
                  </label>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <Button type="submit" variant="primary"><Icon name="send" /> Send</Button>
                    <a className="muted" href="mailto:hello@wealthvibe.co" style={{ textDecoration: "none" }}><Icon name="mail" /> hello@wealthvibe.co</a>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div style={{ display: "grid", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="phone" /><a href="tel:+14129536415" style={{ textDecoration: "none" }}>(412) 953‑6415</a></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="calendar" /><a href="https://calendly.com/your-link" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>Book a consultation</a></div>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><Icon name="map-pin" /><div>Wexford, PA • Pittsburgh Metro</div></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Small smoke-test panel to validate render */}
          <TestsPanel />
        </div>
      </Section>

      {/* Brochure anchor */}
      <div id="brochure" style={{ position: "absolute", left: -9999, top: -9999 }} aria-hidden="true">Brochure download placeholder</div>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__grid">
          <div>
            <div className="brand__title">Wealth Vibe</div>
            <p className="muted" style={{ marginTop: 8 }}>Live with purpose, love without condition, learn without end, act with discipline, and embrace change.</p>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>Quick Links</div>
            <ul className="about__bullets">
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>Compliance</div>
            <p className="muted" style={{ marginTop: 8 }}>This site is for education only. Products and availability vary by state. Consult a licensed professional before making decisions.</p>
          </div>
        </div>
        <div className="container" style={{ textAlign: "center", fontSize: 12, color: "#64748b", paddingBottom: 24 }}>© {year} Wealth Vibe. All rights reserved.</div>
      </footer>
    </div>
  );
}
