import React, { useState } from "react";

const LINKS = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    // stub: integrate with your newsletter backend
    console.log("subscribe:", email);
    setSubscribed(true);
    setTimeout(() => setEmail(""), 600);
  };

  return (
    <footer className="footer-root">
      <div className="max-w-[1200px] mx-auto px-6 py-14 footer-inner">
        <div className="grid md:grid-cols-3 gap-10">
          {/* brand */}
          <div>
            <a href="/" className="flex items-center gap-3 footer-brand">
              <img
                src="/assets/logo.svg"
                alt="FreshMind Studio"
                className="w-11 h-11"
              />
              <div>
                <div className="font-bold text-lg">FreshMind Studio</div>
                <div className="text-sm text-muted">
                  Image tools for creators & teams
                </div>
              </div>
            </a>

            <p className="text-sm text-muted mt-4 max-w-[36ch]">
              Remove backgrounds and compress images with a minimal interface —
              built for speed and clarity.
            </p>
          </div>

          {/* links */}
          <nav aria-label="Quick links" className="footer-links">
            <h4 className="text-sm font-semibold mb-3">Quick links</h4>
            <ul className="space-y-2 text-sm">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a className="footer-link" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact + subscribe */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Contact</h4>
            <div className="text-sm" style={{ color: "var(--accent)" }}>
              <div className="footer-email text-muted">
                hello@freshmind.studio
              </div>
              <div className="mt-2 text-muted">+1 (555) 123-4567</div>
            </div>

            <form className="mt-6 footer-newsletter" onSubmit={subscribe}>
              <label className="text-xs">Subscribe to updates</label>
              <div className="mt-2 flex gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="footer-input"
                  type="email"
                  placeholder="you@company.com"
                  aria-label="Email address"
                  required
                />
                <button
                  className="footer-btn"
                  type="submit"
                  aria-disabled={subscribed}
                >
                  {subscribed ? "Subscribed" : "Subscribe"}
                </button>
              </div>
            </form>

            <div className="mt-6 flex items-center gap-4 footer-social">
              <a aria-label="Twitter" href="#" className="social-link">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path fill="currentColor" d="M20 7.5c..." />
                </svg>
              </a>
              <a aria-label="LinkedIn" href="#" className="social-link">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path fill="currentColor" d="M4.98 3.5C4.98..." />
                </svg>
              </a>
              <a aria-label="Dribbble" href="#" className="social-link">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path fill="currentColor" d="M12 0C5.371 0..." />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-t-muted pt-6 text-center text-sm text-muted">
          © {new Date().getFullYear()} FreshMind Studio ·{" "}
          <a className="footer-small-link" href="/privacy">
            Privacy
          </a>{" "}
          ·{" "}
          <a className="footer-small-link" href="/terms">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
