import React, { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  /* Lock body scroll and manage initial focus */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      // let the panel start its animation then focus first link
      requestAnimationFrame(() => {
        requestAnimationFrame(() => firstLinkRef.current?.focus());
      });
    } else {
      // return focus to toggle for keyboard users
      requestAnimationFrame(() => toggleRef.current?.focus());
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Close on Escape and close when pointerdown outside menu (but not the toggle) */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onPointerDown = (e) => {
      if (!open) return;
      const t = e.target;
      if (menuRef.current?.contains(t)) return; // inside menu
      if (toggleRef.current?.contains(t)) return; // toggle button
      setOpen(false);
    };

    const pointerEvent =
      "onpointerdown" in window ? "pointerdown" : "mousedown";
    window.addEventListener("keydown", onKey);
    window.addEventListener(pointerEvent, onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(pointerEvent, onPointerDown);
    };
  }, [open]);

  /* Basic focus trap while mobile menu is open */
  useEffect(() => {
    if (!open) return;
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      const container = menuRef.current;
      if (!container) return;
      const focusable = Array.from(
        container.querySelectorAll(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [open]);

  return (
    <header className="nav-root">
      <div className="container max-w-[1200px] mx-auto px-6">
        <div className="nav-inner flex items-center justify-between">
          {/* Brand */}
          <a
            href="/"
            className="sm:flex items-center gap-3 nav-brand"
            aria-label="FreshMind Studio home"
          >
            {/* <div className="nav-logo-wrap" aria-hidden>
              <img
                src="/assets/logo.svg"
                alt="FreshMind Studio"
                className="nav-logo"
              />
              <span className="nav-logo-dot" />
            </div> */}
            <div className="nav-logo-title">
              <span>
                <span className="fresh">Fresh</span>{" "}
                <span className="mind">Mind</span>{" "}
                <span className="studio">Studio</span>
              </span>
              <span className="subtitle">Image tools — clean & fast</span>
            </div>
          </a>

          {/* Desktop links */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.slice(0, 4).map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Actions (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/contact" className="nav-action">
              Contact
            </a>

            <a href="#compressor" className="nav-cta">
              Try tools
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            className="md:hidden nav-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            type="button"
          >
            <svg
              className={`nav-toggle-icon ${open ? "open" : ""}`}
              viewBox="0 0 24 24"
              width="22"
              height="22"
              aria-hidden
            >
              <path
                className="line top"
                d="M3 6h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                className="line middle"
                d="M3 12h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                className="line bottom"
                d="M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile overlay + sliding panel */}
      <div
        className={`mobile-overlay md:hidden ${open ? "is-open" : ""}`}
        aria-hidden={!open}
      >
        <div className="overlay-backdrop" onClick={() => setOpen(false)} />

        <aside
          id="mobile-menu"
          ref={menuRef}
          className={`mobile-panel ${open ? "translate-in" : "translate-out"}`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
        >
          <div className="mobile-panel-inner p-5">
            <div className="flex items-center justify-between mb-6">
              <a href="/" className="flex items-center gap-3">
                <img
                  src="/assets/logo.svg"
                  alt="FreshMind"
                  className="w-8 h-8"
                />
                <div className="text-sm font-bold">FreshMind</div>
              </a>

              <button
                className="p-2 rounded-md"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                type="button"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="mobile-links flex flex-col gap-4" role="menu">
              {NAV_LINKS.map((link, idx) => (
                <a
                  key={link.href}
                  href={link.href}
                  ref={idx === 0 ? firstLinkRef : null}
                  onClick={() => setOpen(false)}
                  className="mobile-link"
                  role="menuitem"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href="#compressor"
                onClick={() => setOpen(false)}
                className="mobile-cta"
              >
                Try tools
              </a>
              <a
                href="/contact"
                onClick={() => setOpen(false)}
                className="mobile-action"
              >
                Contact
              </a>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
