import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "About", href: "/about" },
  { label: "Faq", href: "/#faq" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fm-st-navbar">
      <div className="fm-st-navbar-container">
        {/* LOGO */}
        <a href="/" className="fm-st-logo">
          <h2>Focus Studio</h2>
          <span>- Creative SaaS Solutions -</span>
        </a>

        {/* DESKTOP NAV */}
        <nav className="fm-st-navlinks">
          {links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="fm-st-navbar-actions">
          <a href="/contact" className="fm-st-contact-btn">
            Contact
          </a>

          {/* MOBILE TOGGLE */}
          <button
            className={`fm-st-menu-btn ${open ? "active" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fm-st-mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="fm-st-mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 24,
                stiffness: 220,
              }}
            >
              <div className="fm-st-mobile-top">
                <div className="fm-st-logo">
                  <h2>Focus Studio</h2>
                  <span>- the tag -</span>
                </div>

                <button
                  className="fm-st-close-btn"
                  onClick={() => setOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="fm-st-mobile-links">
                {links.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    {link.label}
                  </motion.a>
                ))}

                <a
                  href="/contact"
                  className="fm-st-mobile-contact"
                  onClick={() => setOpen(false)}
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
