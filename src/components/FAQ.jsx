import React, { useState } from "react";

/**
 * FAQ accordion
 * - keyboard accessible (Enter / Space to toggle)
 * - smooth max-height transition
 */

const DEFAULT_FAQ = [
  {
    q: "What image formats do you support?",
    a: "We support JPG, PNG, and WebP. For best results with remove.bg use clear high-contrast images (product shots, portraits).",
  },
  {
    q: "How large can my upload be?",
    a: "Client-side compression reduces size before upload. The serverless proxy respects remove.bg limits; if your account supports large files, we forward them. For best speed, compress to under 5MB.",
  },
  {
    q: "Is my API key stored on the client?",
    a: "No. Your remove.bg API key is stored only in server environment variables (Vercel). The client posts only image data to our serverless proxy.",
  },
  {
    q: "What about privacy and storage?",
    a: "FreshMind compresses images in the browser. We forward the image to remove.bg and return the processed result. We do not persist images on the server by default — if you choose to store images in S3, that will be explicit.",
  },
  {
    q: "Do you have rate limits or quotas?",
    a: "Remove.bg enforces its own quota on API keys. If you hit limits you'll receive a 429 response. We recommend monitoring your remove.bg dashboard and caching repeated images where possible.",
  },
  {
    q: "Can I use FreshMind in a team or integrate it?",
    a: "Yes — the Team tier includes batch processing and integrations like S3/webhooks. For custom SLAs and onboarding, contact sales.",
  },
];

function Chevron({ open }) {
  return (
    <svg
      className={`w-4 h-4 transform transition-transform ${
        open ? "rotate-180" : ""
      }`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FAQ({ id = "faq", faqs = DEFAULT_FAQ }) {
  const [openIdx, setOpenIdx] = useState(-1);

  const toggle = (i) => {
    setOpenIdx((prev) => (prev === i ? -1 : i));
  };

  return (
    <section id={id} className="py-16 bg-white">
      <div className="max-w-[900px] mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text)]">
            Frequently asked questions
          </h2>
          <p className="mt-3 text-gray-600">
            Common questions about compression, the remove.bg proxy, and
            billing.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = i === openIdx;
            return (
              <div
                key={i}
                className="border border-gray-50 rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm bg-white"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => toggle(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(i);
                    }
                  }}
                >
                  <span className="font-medium text-[var(--text)]">{f.q}</span>
                  <span className="ml-4 text-gray-500">
                    <Chevron open={isOpen} />
                  </span>
                </button>

                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-${i}`}
                  style={{
                    maxHeight: isOpen ? 400 : 0,
                    overflow: "hidden",
                    transition: "max-height 280ms ease",
                    background: "#fff",
                    padding: isOpen ? "16px 20px" : "0 20px",
                  }}
                >
                  <div className="text-sm text-gray-600">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
