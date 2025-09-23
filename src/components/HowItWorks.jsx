import React from "react";

/* Inline icons (monochrome so they inherit color) */
const Icon = ({ type, className = "w-5 h-5" }) => {
  if (type === "upload")
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 7l4-4 4 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 15v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (type === "compress")
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M21 15V9a2 2 0 0 0-2-2h-3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 9v6a2 2 0 0 0 2 2h3"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 3v18"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 11h8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (type === "remove")
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 7h18"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 11v6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 11v6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 7l1-3h6l1 3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (type === "download")
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v12"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 15v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const defaultSteps = [
  {
    title: "Upload image",
    description: "Drag & drop or choose a file. Preview instantly.",
    icon: "upload",
    anchor: "#compressor",
  },
  {
    title: "Compress in browser",
    description:
      "Client-side compression reduces upload size while preserving quality.",
    icon: "compress",
    anchor: "#compressor",
  },
  {
    title: "Remove background",
    description:
      "We proxy securely to remove.bg via serverless — your key stays on the server.",
    icon: "remove",
    anchor: "#remover",
  },
  {
    title: "Download & export",
    description:
      "Get a transparent PNG or export for product pages and marketing.",
    icon: "download",
    anchor: "#remover",
  },
];

export default function HowItWorksModern({
  eyebrow = "How it works",
  heading = "Fast, friendly, production-ready",
  sub = "From upload to download — four simple steps that save time and bandwidth.",
  stepsData = defaultSteps,
}) {
  const onAnchorClick = (e, anchor) => {
    if (anchor && anchor.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(anchor);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="how" className="how-root py-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="how-eyebrow inline-flex items-center gap-3 rounded-full px-3 py-1 text-xs font-medium mb-4">
            <span className="how-eyebrow-dot" aria-hidden />
            <span className="how-eyebrow-text">{eyebrow}</span>
          </div>

          <h2 className="how-heading text-3xl sm:text-4xl font-extrabold leading-tight">
            {heading}
          </h2>
          <p className="how-sub mt-4">{sub}</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href="#compressor"
              className="how-cta how-cta-primary inline-flex items-center gap-3 px-4 py-2 rounded-full font-semibold"
              onClick={(e) => onAnchorClick(e, "#compressor")}
            >
              Try the tools
            </a>

            <a
              href="/contact"
              className="how-cta how-cta-ghost inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium"
            >
              Contact
            </a>
          </div>
        </div>

        <ol
          className="how-steps mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          role="list"
          aria-label="How it works"
        >
          {stepsData.map((s, i) => (
            <li
              key={s.title}
              className="step-card"
              aria-labelledby={`how-step-${i}`}
            >
              <div className="step-topbar" aria-hidden />
              <div className="flex items-start gap-4">
                <div>
                  <div id={`how-step-${i}`} className="step-number" aria-hidden>
                    {i + 1}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="icon-badge" aria-hidden>
                      <Icon type={s.icon} className="w-5 h-5" />
                    </div>

                    <h3 className="step-title text-base font-semibold">
                      {s.title}
                    </h3>
                  </div>

                  <p className="step-desc mt-3">{s.description}</p>

                  {s.anchor && (
                    <div className="mt-4">
                      <a
                        href={s.anchor}
                        onClick={(e) => onAnchorClick(e, s.anchor)}
                        className="step-link"
                      >
                        Open {s.title.toLowerCase()}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 text-sm text-center how-privacy">
          <strong>Privacy:</strong> images are compressed client-side; your
          remove.bg API key remains safe in server environment variables only.
        </div>
      </div>
    </section>
  );
}
