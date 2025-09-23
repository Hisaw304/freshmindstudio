// src/components/FeaturesModern.jsx
import React from "react";

/* --- small inline icons (reused & tuned to accept color via parent) --- */
const IconSpark = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 2v4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 18v4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.2 6.2l2.8 2.8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 12l5 0"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 17l2 2"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconShield = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 2l7 3v5c0 5-3.6 9.7-7 11-3.4-1.3-7-6-7-11V5l7-3z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconBolt = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M13 2L3 14h7l-1 8L21 10h-7l-1-8z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconImage = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M8 11l2 2 3-3 4 5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconApi = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M6 7v10"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 7v10"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 7v10"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTeam = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 21c1.5-4 6-6 10-6s8.5 2 10 6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* --- data --- */
const FEATURES = [
  {
    title: "Client-side compression",
    desc: "Compress images before upload — saves bandwidth and speeds processing.",
    Icon: IconBolt,
  },
  {
    title: "Secure serverless proxy",
    desc: "We forward images to remove.bg from a Vercel function; your API key never leaves the server.",
    Icon: IconShield,
  },
  {
    title: "Fast results",
    desc: "Optimized flow and small payloads mean faster turnaround for creators and teams.",
    Icon: IconSpark,
  },
  {
    title: "Quality outputs",
    desc: "Transparent PNG exports with preserved edges and color fidelity for product shots.",
    Icon: IconImage,
  },
  {
    title: "API & integrations",
    desc: "Vercel-ready serverless route and lightweight client hooks — plug into your stack.",
    Icon: IconApi,
  },
  {
    title: "Team friendly",
    desc: "Batch-friendly workflow and a clean UI designed for rapid review and export.",
    Icon: IconTeam,
  },
];

/* --- Feature card subcomponent --- */
function FeatureCard({ Icon, title, desc }) {
  return (
    <article
      tabIndex={0}
      className="feature-card group"
      role="article"
      aria-labelledby={`feature-${title.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <div className="feature-top">
        <div className="feature-icon" aria-hidden>
          {/* icon container uses accent-blue for the icon (stroke/currentColor) and yellow tint behind */}
          <div className="feature-icon-bg">
            <Icon className="icon-svg" />
          </div>
        </div>
        <h3
          id={`feature-${title.replace(/\s+/g, "-").toLowerCase()}`}
          className="feature-title"
        >
          {title}
        </h3>
      </div>

      <p className="feature-desc">{desc}</p>
    </article>
  );
}

/* --- main export --- */
export default function Features({ id = "features" }) {
  return (
    <section id={id} className="features-section relative">
      {/* decorative warm band to echo screenshot */}
      <div className="features-band" aria-hidden />
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-[rgba(255,255,255,0.85)] rounded-full px-3 py-1 text-xs font-medium text-[var(--muted-color)] mb-4">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            Features & benefits
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-[var(--text-strong)]">
            Everything you need to ship images
          </h2>

          <p className="mt-4 text-[var(--muted-color)]">
            A focused toolset: compress client-side, remove backgrounds
            securely, and export production-ready assets.
          </p>
        </div>

        <ol
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Features"
        >
          {FEATURES.map((f) => (
            <li key={f.title}>
              <FeatureCard Icon={f.Icon} title={f.title} desc={f.desc} />
            </li>
          ))}
        </ol>

        <div className="mt-8 text-center">
          <a
            href="#compressor"
            className="features-cta inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold focus:outline-none focus-visible:ring-4"
            aria-label="Try compressor & remover"
          >
            <span className="cta-dot" aria-hidden />
            Try compressor & remover
          </a>
        </div>
      </div>
    </section>
  );
}
