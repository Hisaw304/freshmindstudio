import {
  Zap,
  ShieldCheck,
  Wand2,
  Layers3,
  Clock3,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: <Zap />,
    title: "Fast Processing",
    desc: "Optimize files and generate results in seconds with a streamlined workflow designed for speed and efficiency.",
  },
  {
    icon: <ShieldCheck />,
    title: "Secure & Private",
    desc: "Your uploads are handled securely with privacy-focused processing and automatic cleanup after completion.",
  },
  {
    icon: <Wand2 />,
    title: "AI-Powered Utilities",
    desc: "Modern AI-driven tools help automate repetitive editing and improve creative workflows effortlessly.",
  },
  {
    icon: <Layers3 />,
    title: "All-In-One Platform",
    desc: "Manage image tools, PDF utilities, file optimization, and future creative tools from one place.",
  },
  {
    icon: <Clock3 />,
    title: "No Software Needed",
    desc: "Everything runs directly in your browser so you can work anywhere without installing heavy applications.",
  },
  {
    icon: <Sparkles />,
    title: "Built To Scale",
    desc: "Focus Studio is expanding into a complete productivity ecosystem with more powerful tools coming soon.",
  },
];

export default function FeaturesBenefits() {
  return (
    <section className="fm-st-features">
      <div className="fm-st-features-container">
        {/* HEADER */}
        <motion.div
          className="fm-st-features-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="fm-st-features-badge">
            <span>Features & Benefits</span>
          </div>

          <h2>
            Built for{" "}
            <span className="fm-st-highlight">
              speed, simplicity, and modern creative
            </span>{" "}
            workflows
          </h2>

          <p>
            Focus Studio combines powerful online utilities with a clean user
            experience to help creators, freelancers, teams, and businesses work
            smarter. From image optimization to future AI-powered tools, every
            feature is designed to save time and improve productivity.
          </p>
        </motion.div>

        {/* GRID */}
        <div className="fm-st-features-grid">
          {FEATURES.map((item, index) => (
            <motion.div
              key={index}
              className="fm-st-feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
            >
              <div className="fm-st-feature-icon">{item.icon}</div>

              <h3>{item.title}</h3>

              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
