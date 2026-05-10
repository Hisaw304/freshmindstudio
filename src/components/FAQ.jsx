import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "What is Focus Studio and how does it work?",
    answer:
      "Focus Studio is a growing online platform that provides modern browser-based utilities designed to help creators, freelancers, businesses, and teams work more efficiently. Instead of downloading heavy software or complicated desktop applications, users can access simple tools directly from their browser. Our platform currently focuses on image optimization, background removal, and PDF utilities, with plans to expand into additional creative and productivity tools over time. Every tool is designed around speed, accessibility, and ease of use so users can complete tasks quickly without unnecessary complexity.",
  },

  {
    question: "Are my uploaded files secure and private?",
    answer:
      "Yes. We take privacy and file security seriously. Files uploaded to Focus Studio are processed securely and are not permanently stored unless specifically required for functionality. We aim to minimize data retention and automatically clear temporary processing data whenever possible. Our goal is to provide users with a safe environment for handling sensitive documents, images, and creative assets while maintaining a fast and reliable experience.",
  },

  {
    question: "Do I need to install software to use the tools?",
    answer:
      "No installation is required. Focus Studio is completely browser-based, which means you can use the platform instantly on desktop, tablet, or mobile devices without downloading applications or plugins. This allows users to access tools from anywhere while keeping workflows lightweight and convenient. Whether you are compressing images, editing files, or using future AI-powered utilities, everything happens directly online for a streamlined experience.",
  },

  {
    question: "Will more tools be added in the future?",
    answer:
      "Absolutely. Focus Studio is being built as a long-term creative utilities ecosystem rather than a single-purpose tool website. While we are currently focused on image and PDF workflows, we plan to expand into additional categories including AI-powered editing, conversion tools, productivity utilities, automation features, file management solutions, and creator-focused resources. The platform is designed to scale over time so users can rely on one central workspace for multiple everyday digital tasks.",
  },

  {
    question: "Does image compression reduce quality?",
    answer:
      "Our image compression system is designed to significantly reduce file sizes while preserving as much visual quality as possible. In most cases, users will notice little to no visible quality loss while benefiting from faster uploads, improved website performance, reduced storage usage, and easier sharing across platforms. Different compression settings and dimensions can also be adjusted depending on whether users prioritize maximum quality or smaller file sizes.",
  },

  {
    question: "Can I use Focus Studio on mobile devices?",
    answer:
      "Yes. Focus Studio is fully responsive and optimized for modern mobile devices and tablets. Users can upload files, process images, remove backgrounds, manage PDFs, and access future tools directly from their phones without needing desktop software. The interface is designed to remain clean and easy to use across different screen sizes while maintaining fast performance and accessibility.",
  },

  {
    question: "Is Focus Studio free to use?",
    answer:
      "Many of the current tools are available for free while the platform continues to grow. In the future, we may introduce premium features, advanced processing capabilities, higher usage limits, or business-focused plans for teams and professionals who require additional functionality. However, our goal is to always maintain accessible tools that provide real value for creators, freelancers, and businesses of all sizes.",
  },
];

export default function FAQ() {
  const [active, setActive] = useState(0);

  return (
    <section className="fm-st-faq">
      <div className="fm-st-faq-container">
        {/* HEADER */}
        <motion.div
          className="fm-st-faq-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="fm-st-faq-badge">
            <span>Frequently Asked Questions</span>
          </div>

          <h2>
            Everything you need to know about <span>Focus Studio</span>
          </h2>

          <p>
            Learn more about how the platform works, how your files are handled,
            and what to expect as Focus Studio continues expanding into a
            complete online utilities ecosystem.
          </p>
        </motion.div>

        {/* FAQ LIST */}
        <div className="fm-st-faq-list">
          {FAQS.map((faq, index) => {
            const isOpen = active === index;

            return (
              <motion.div
                key={index}
                className={`fm-st-faq-item ${isOpen ? "active" : ""}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
              >
                <button
                  className="fm-st-faq-question"
                  onClick={() => setActive(isOpen ? null : index)}
                >
                  <span>{faq.question}</span>

                  <div className="fm-st-faq-toggle" />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="fm-st-faq-answer-wrap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="fm-st-faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
