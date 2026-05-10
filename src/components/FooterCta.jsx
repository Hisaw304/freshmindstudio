// src/components/FooterCta.jsx

import { motion } from "framer-motion";

export default function FooterCta() {
  return (
    <section className="fm-st-footer-cta">
      <motion.div
        className="fm-st-footer-cta-content"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="fm-st-footer-cta-badge">
          <span>Built for modern creators</span>
        </div>

        <h2>Ready to simplify your workflow?</h2>

        <p>
          Compress images, remove backgrounds, and access powerful creative
          tools — all in one fast, modern platform.
        </p>

        <div className="fm-st-footer-cta-actions">
          <a href="/tools" className="fm-st-footer-cta-primary">
            Explore Tools
          </a>

          <a href="/signup" className="fm-st-footer-cta-secondary">
            Start Free
          </a>
        </div>
      </motion.div>
    </section>
  );
}
