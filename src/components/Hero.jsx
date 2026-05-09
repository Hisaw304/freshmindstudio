// src/components/Hero.jsx

import { motion } from "framer-motion";
import { Sparkles, Wand2, ImagePlus, ShieldCheck, Volume2 } from "lucide-react";

import heroImage from "../assets/hero.jpg";

export default function Hero() {
  return (
    <section className="fm-st-hero">
      {/* BG */}
      <div className="fm-st-hero-grid" />

      <div className="fm-st-hero-container">
        {/* LEFT IMAGE */}
        <motion.div
          className="fm-st-hero-visual"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="fm-st-hero-image-wrap">
            <img src={heroImage} alt="Focus Studio Dashboard" />

            {/* FLOATING LABELS */}

            <motion.div
              className="fm-st-floating-card top-right"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            >
              <Sparkles size={16} />
              <span>AI Powered</span>
            </motion.div>

            <motion.div
              className="fm-st-floating-card bottom-left"
              animate={{ y: [0, 12, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            >
              <ImagePlus size={16} />
              <span>Creative Utilities</span>
            </motion.div>

            <motion.div
              className="fm-st-floating-card middle-card"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            >
              <Wand2 size={16} />
              <span>More Tools Coming</span>
            </motion.div>

            <motion.div
              className="fm-st-floating-card top-left"
              animate={{ x: [0, 8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            >
              <ShieldCheck size={16} />
              <span>Fast & Secure</span>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT CONTENT */}
        <motion.div
          className="fm-st-hero-content"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* TOP BADGE */}
          <div className="fm-st-hero-badge">
            <span>Modern SaaS Utilities Platform</span>
          </div>

          {/* HEADING */}
          <h1>
            Smart{" "}
            <span className="fm-st-heading-icon">
              <Volume2 className="fm-st-heading-speaker" />
              tools
            </span>{" "}
            built for creators and businesses
          </h1>

          {/* MINI INFO */}
          <div className="fm-st-hero-mini">
            <span>
              Starting with image tools today — expanding into a complete
              creative toolkit tomorrow.
            </span>
          </div>

          {/* TEXT */}
          <p>
            Focus Studio is building a growing collection of modern online tools
            designed to help creators, freelancers, teams, and businesses work
            faster and smarter. From image optimization to future AI-powered
            utilities, our focus is creating simple tools with powerful results.
          </p>

          {/* CTA */}
          <div className="fm-st-hero-actions">
            <a href="/tools" className="fm-st-hero-btn">
              Explore Tools
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
