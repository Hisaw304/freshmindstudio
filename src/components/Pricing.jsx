// src/components/PricingModern.jsx
import React, { useMemo, useState } from "react";

/* ----- data ----- */
const TIERS = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    features: [
      "Basic compression",
      "Single image at a time",
      "Watermarked previews",
      "Community support",
    ],
    cta: { label: "Get started", href: "#compressor" },
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 9,
    features: [
      "Faster compression presets",
      "High-res transparent PNG",
      "Priority queueing",
      "Email support",
    ],
    cta: { label: "Upgrade to Pro", href: "#pricing" },
    recommended: true,
  },
  {
    id: "team",
    name: "Team",
    monthly: 29,
    features: [
      "Batch processing",
      "Team seats & access controls",
      "S3 / webhook integrations",
      "Priority SLA & onboarding",
    ],
    cta: { label: "Contact sales", href: "/contact" },
  },
];

function formatPrice(amount) {
  if (amount === 0) return "Free";
  if (Number.isInteger(amount)) return `$${amount}`;
  return `$${amount.toFixed(2)}`;
}

/* small icon used for feature list */
const Check = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function PricingModern({ defaultCycle = "monthly" }) {
  const [cycle, setCycle] = useState(defaultCycle); // "monthly" | "yearly"

  const tiers = useMemo(
    () =>
      TIERS.map((t) => {
        const monthly = t.monthly;
        const yearly = +(monthly * 12 * 0.8); // 20% off for yearly
        return { ...t, display: { monthly, yearly } };
      }),
    []
  );

  const savingsPercent = 20;
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section id="pricing" className="pricing-section">
      <div className="pricing-inner">
        <div className="pricing-header">
          <div className="eyebrow">
            <span className="dot" /> Pricing
          </div>

          <h2 className="pricing-title">Simple pricing. No surprises.</h2>
          <p className="pricing-sub">
            Monthly or discounted yearly billing — choose what fits your
            workflow.
          </p>

          {/* toggle */}
          <div
            className="billing-toggle"
            role="tablist"
            aria-label="Billing cycle"
          >
            <button
              className={`toggle-button ${cycle === "monthly" ? "active" : ""}`}
              aria-pressed={cycle === "monthly"}
              onClick={() => setCycle("monthly")}
            >
              Monthly
            </button>

            <div className="toggle-or">or</div>

            <button
              className={`toggle-button ${cycle === "yearly" ? "active" : ""}`}
              aria-pressed={cycle === "yearly"}
              onClick={() => setCycle("yearly")}
            >
              Yearly{" "}
              <span className="savings-pill">Save {savingsPercent}%</span>
            </button>
          </div>
        </div>

        {/* tiers grid */}
        <div className="tiers-grid" role="list" aria-label="Pricing tiers">
          {tiers.map((t, idx) => {
            const price =
              cycle === "monthly" ? t.display.monthly : t.display.yearly;
            const showPriceLabel =
              price === 0
                ? "Free"
                : cycle === "monthly"
                ? `${formatPrice(price)}/mo`
                : `${formatPrice(price)}/yr`;
            // show the monthly-equivalent for yearly plans (with two decimals)
            const monthlyEquivalent =
              cycle === "yearly" && price !== 0
                ? `$${(price / 12).toFixed(2)}/mo`
                : null;

            return (
              <article
                key={t.id}
                role="listitem"
                className={`tier-card ${
                  t.recommended ? "tier-recommended" : ""
                }`}
                aria-labelledby={`tier-${t.id}`}
                tabIndex={0}
                style={{ transition: prefersReduced ? "none" : undefined }}
              >
                {/* accent strip */}
                <div className="tier-top" aria-hidden />

                {t.recommended && <div className="ribbon">Most popular</div>}

                <h3 id={`tier-${t.id}`} className="tier-name">
                  {t.name}
                </h3>

                <div className="tier-price">
                  <div className="price-major">
                    {price === 0 ? "Free" : formatPrice(price)}
                  </div>
                  <div className="price-sub">
                    {price === 0
                      ? ""
                      : cycle === "monthly"
                      ? "/month"
                      : "/year"}
                  </div>
                </div>

                {monthlyEquivalent && (
                  <div className="monthly-equivalent">
                    {monthlyEquivalent} billed annually
                  </div>
                )}

                <ul className="tier-features" aria-hidden={false}>
                  {t.features.map((f, i) => (
                    <li key={i} className="feature-item">
                      <span className="feature-icon" aria-hidden>
                        <Check className="w-4 h-4" />
                      </span>
                      <span className="feature-text">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="tier-cta">
                  <a
                    className={`cta ${
                      t.recommended ? "cta-primary" : "cta-ghost"
                    }`}
                    href={t.cta.href}
                    aria-label={t.cta.label}
                  >
                    {t.cta.label}
                  </a>
                </div>

                <div className="tier-foot">Cancel anytime.</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
