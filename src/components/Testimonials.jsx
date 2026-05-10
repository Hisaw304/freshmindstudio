import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Marcus Lee",
    role: "Creative Director",
    company: "Northline Media",
    text: "Focus Studio completely simplified our workflow. The image tools are fast, reliable, and incredibly easy to use. What impressed us most was how clean and modern the experience feels compared to most online utility platforms.",
  },

  {
    name: "Nina Patel",
    role: "Marketing Lead",
    company: "Elevate Commerce",
    text: "We regularly optimize hundreds of assets for campaigns, and Focus Studio has already saved our team a significant amount of time. The platform feels premium, lightweight, and built with real creators in mind.",
  },

  {
    name: "Adrian Flores",
    role: "Founder",
    company: "Studio Nova",
    text: "The background remover alone is worth bookmarking. Results are clean, processing is fast, and the interface feels far more polished than many larger competitors. Excited to see the future tools they release.",
  },

  {
    name: "Jasmine Brooks",
    role: "Brand Strategist",
    company: "Lumen Creative",
    text: "Focus Studio strikes the perfect balance between simplicity and functionality. Everything feels thoughtfully designed, from the upload experience to the processing flow and final downloads.",
  },

  {
    name: "Ethan Cole",
    role: "Product Designer",
    company: "PixelForge",
    text: "As someone who works with visuals daily, having fast browser-based utilities makes a huge difference. Focus Studio feels modern, responsive, and refreshingly uncluttered.",
  },

  {
    name: "Maya Reynolds",
    role: "Operations Manager",
    company: "BrightScale",
    text: "Most online tools feel outdated or overloaded with ads. Focus Studio feels premium and professional. The workflow is smooth, the tools are practical, and the platform clearly has long-term potential.",
  },
];

export default function Testimonials() {
  return (
    <section className="fm-st-testimonials">
      <div className="fm-st-testimonials-container">
        {/* HEADER */}
        <motion.div
          className="fm-st-testimonials-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="fm-st-testimonials-badge">
            <span>Testimonials</span>
          </div>

          <h2>
            Trusted by{" "}
            <span className="fm-st-highlight">
              creators, teams, and growing businesses
            </span>
          </h2>

          <p>
            Focus Studio is designed to help modern teams and creators work
            faster with simple yet powerful online utilities built around speed,
            usability, and efficiency.
          </p>
        </motion.div>

        {/* LIST */}
        <div className="fm-st-testimonials-list">
          <motion.div
            className="fm-st-testimonials-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* BIG QUOTE */}
            <div className="fm-st-testimonials-quote">
              <Quote />
            </div>

            {TESTIMONIALS.map((item, index) => (
              <div
                key={index}
                className={`fm-st-testimonial-row ${
                  index !== TESTIMONIALS.length - 1 ? "with-border" : ""
                }`}
              >
                {/* LEFT */}
                <div className="fm-st-testimonial-user">
                  <h4>{item.name}</h4>

                  <span>
                    {item.role} • {item.company}
                  </span>

                  <div className="fm-st-testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fill="currentColor" />
                    ))}
                  </div>
                </div>

                {/* DIVIDER */}
                <div className="fm-st-testimonial-divider" />

                {/* RIGHT */}
                <p className="fm-st-testimonial-text">“{item.text}”</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
