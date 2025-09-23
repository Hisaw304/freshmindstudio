// src/components/Hero.jsx
import React, { useEffect, useState } from "react";

export default function Hero({
  eyebrow = "What's new",
  titleMain = "Turn",
  titleHighlight = "Support",
  titleSuffix = "into Action",
  subtitle = "FreshMind Studio removes backgrounds and compresses images — fast, clean, and production-ready. Optimized for creators and teams.",
  ctaPrimary = { label: "Get started — it's free", href: "#how" },
  ctaSecondary = { label: "Contact sales", href: "/contact" },
  imageSrc = "/images/hero.jpg",
  imageAlt = "FreshMind Studio preview",
}) {
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq ? mq.matches : false);
    if (!mq?.matches) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(true);
    }
  }, []);

  const handleCtaClick = (href, e) => {
    if (href && href.startsWith("#")) {
      e?.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const webpCandidate = imageSrc.replace(/\.(jpe?g|png)$/i, ".webp");

  return (
    <section className="relative overflow-hidden bg-[var(--bg)]">
      <div className="max-w-[1200px] mx-auto px-6 py-16 lg:py-28">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 items-center gap-12 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } ${reduceMotion ? "motion-reduce:transition-none" : ""}`}
        >
          {/* LEFT: copy */}
          <div>
            <div className="inline-flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1 text-xs font-medium text-gray-700 mb-6 shadow-sm">
              <span
                aria-hidden="true"
                className="inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-[var(--accent)]"
              />
              <span>{eyebrow}</span>
              <a href="/about" className="ml-2 underline text-gray-500">
                Learn more
              </a>
            </div>

            {/* TITLE — uses hero-title + hero-highlight (from Hero.css) */}
            <h1 className="hero-title text-4xl sm:text-5xl lg:text-[3.6rem] leading-tight">
              <span className="block">
                <span className="mr-2">{titleMain}</span>

                <span
                  className="inline-flex items-center gap-3 hero-highlight rounded-md px-3 py-1"
                  aria-hidden="true"
                >
                  {/* the first child span is styled in the CSS we provided earlier */}
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white shadow-sm">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M3 10v4h4l7 5V5L7 10H3z" />
                    </svg>
                  </span>

                  <strong className="font-extrabold tracking-tight text-[var(--text)]">
                    {titleHighlight}
                  </strong>
                </span>

                <span className="ml-3">{titleSuffix}</span>
              </span>
            </h1>

            <p className="mt-6 text-gray-600 max-w-[60ch]">{subtitle}</p>

            {/* CTAs — use btn, btn-primary, btn-ghost classes from Hero.css */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={ctaPrimary.href}
                onClick={(e) => handleCtaClick(ctaPrimary.href, e)}
                className="btn btn-primary inline-flex items-center justify-center px-5 py-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--accent)]"
                aria-label={ctaPrimary.label}
              >
                {ctaPrimary.label}
              </a>

              <a
                href={ctaSecondary.href}
                onClick={(e) => handleCtaClick(ctaSecondary.href, e)}
                className="btn btn-ghost inline-flex items-center justify-center px-5 py-3 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-300"
                aria-label={ctaSecondary.label}
              >
                {ctaSecondary.label}
              </a>
            </div>

            {/* feature rows — keep small dot using accent token */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-500">
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] mt-2" />
                <div>
                  <div className="text-gray-900 font-semibold">
                    Client compression
                  </div>
                  <div className="text-xs">Compress before upload</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] mt-2" />
                <div>
                  <div className="text-gray-900 font-semibold">
                    Remove.bg proxy
                  </div>
                  <div className="text-xs">Serverless & secure</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] mt-2" />
                <div>
                  <div className="text-gray-900 font-semibold">
                    Download ready
                  </div>
                  <div className="text-xs">Transparent PNG</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] mt-2" />
                <div>
                  <div className="text-gray-900 font-semibold">Live stats</div>
                  <div className="text-xs">Clear dashboards</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: image / preview card */}
          <div className="relative w-full">
            {/* decorative radial accent — class comes from Hero.css (preview-deco) */}
            <div
              aria-hidden="true"
              className="preview-deco pointer-events-none hidden md:block absolute -right-12 -top-12 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
            />

            <div className="relative preview-card overflow-hidden rounded-2xl shadow-xl">
              <picture>
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-[420px] object-cover md:object-contain block"
                  loading="eager"
                  width="960"
                  height="600"
                />
              </picture>

              {/* floating overlay panel (styled by preview-overlay in CSS) */}
              <div className="absolute bottom-5 right-5 preview-overlay p-3 w-44">
                <div className="text-xs font-semibold text-gray-900">
                  Fast export
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Transparent PNG • 350 KB
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
