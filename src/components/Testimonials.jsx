import React from "react";

/**
 * Generate two HSL colors from a name for a pleasant gradient.
 * Returns an object { g1, g2, fg } where g1/g2 are CSS color strings
 * and fg is a readable foreground color ('#111' or '#fff').
 */
function gradientFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  const h2 = (h + 30) % 360;
  // two pastel-ish colors
  const g1 = `hsl(${h}, 66%, 78%)`;
  const g2 = `hsl(${h2}, 62%, 72%)`;
  // decide foreground for contrast (darker text on these pastels)
  const fg = "#111";
  return { g1, g2, fg };
}

/** initials from first + last words */
function initialsFromName(name) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = (parts.length > 1 ? parts[parts.length - 1][0] : "") || "";
  return (first + last).toUpperCase();
}

const DEFAULT_TESTIMONIALS = [
  {
    name: "Sarah Collins",
    role: "Product Designer",
    quote:
      "FreshMind saved hours on our product photo workflow — results are crisp and exports are perfect for our store.",
  },
  {
    name: "John Miller",
    role: "E-commerce Lead",
    quote:
      "Compression + background removal in one place. Fast, reliable, and simple to use.",
  },
  {
    name: "Aisha Bello",
    role: "Content Creator",
    quote:
      "I love that images are compressed first — it made batch processing so much faster.",
  },
  {
    name: "Mark Zhang",
    role: "Founder",
    quote:
      "Great for prototypes and production. The serverless proxy keeps our API key safe.",
  },
];

export default function Testimonials({
  id = "testimonials",
  testimonials = DEFAULT_TESTIMONIALS,
}) {
  return (
    <section id={id} className="tm-root py-16">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="tm-eyebrow inline-flex items-center gap-3 rounded-full px-3 py-1 text-xs font-medium mb-4">
            <span className="tm-eyebrow-dot" aria-hidden />
            <span className="tm-eyebrow-text">Trusted by creators</span>
          </div>

          <h2 className="tm-heading text-3xl sm:text-4xl font-extrabold leading-tight">
            What people are saying
          </h2>

          <p className="tm-lead mt-4">
            Short, honest feedback from creators and teams using FreshMind
            Studio.
          </p>
        </div>

        <div
          className="mt-10 tm-grid"
          role="list"
          aria-label="Customer testimonials"
        >
          {testimonials.map((t, i) => {
            const { g1, g2, fg } = gradientFromName(t.name || String(i));
            const initials = initialsFromName(t.name || "");
            return (
              <figure
                key={i}
                className="tm-card"
                role="group"
                aria-labelledby={`tm-quote-title-${i}`}
                tabIndex={0} // allow keyboard focus to reveal focus styles
              >
                <blockquote className="tm-quote">
                  <p id={`tm-quote-title-${i}`} className="tm-quote-text">
                    “{t.quote}”
                  </p>
                </blockquote>

                <figcaption className="tm-caption">
                  <div
                    className="tm-avatar"
                    role="img"
                    aria-label={`Avatar of ${t.name}`}
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${g1}, ${g2})`,
                      color: fg,
                      boxShadow: `0 6px 18px rgba(8,112,186,0.12), inset 0 -6px 18px rgba(0,0,0,0.02)`,
                    }}
                  >
                    <span className="tm-initials">{initials}</span>
                    <span className="tm-avatar-ring" aria-hidden />
                  </div>

                  <div className="tm-meta">
                    <div className="tm-name">{t.name}</div>
                    <div className="tm-role">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
