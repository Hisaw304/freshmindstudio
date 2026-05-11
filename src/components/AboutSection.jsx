import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import aboutImage from "../assets/about-image.jpg";

const POINTS = [
  "Modern tools designed for creators and businesses",
  "Fast cloud-based workflows with clean user experience",
  "Growing platform with expanding creative utilities",
  "Built with performance, simplicity, and scalability in mind",
];

export default function AboutSection() {
  return (
    <section className="fm-st-about">
      <div className="fm-st-about-container">
        {/* LEFT */}
        <motion.div
          className="fm-st-about-content"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="fm-st-section-tag">
            <span>About Focus Studio</span>
          </div>

          <h2>
            Building modern online{" "}
            <span className="fm-st-highlight">
              tools for creators, teams, and digital
            </span>{" "}
            workflows
          </h2>

          <p>
            Focus Studio is a growing SaaS platform focused on creating powerful
            yet simple online tools that help people work smarter. From image
            optimization and PDF utilities to future AI-powered workflows, our
            mission is to make digital productivity more accessible.
          </p>

          <p>
            We believe modern software should feel fast, intuitive, and easy to
            use. Every tool we build is designed with simplicity, performance,
            and real-world usability in mind.
          </p>

          {/* POINTS */}
          <div className="fm-st-about-points">
            {POINTS.map((item, index) => (
              <div key={index} className="fm-st-about-point">
                <CheckCircle2 />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <div className="fm-st-about-actions">
            <a href="/about" className="fm-st-about-btn">
              Learn More About Us
            </a>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          className="fm-st-about-visual"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="fm-st-about-image">
            <img src={aboutImage} alt="Focus Studio workspace" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
