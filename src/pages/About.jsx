import React from "react";

/* Helpers */
function initialsFromName(name) {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = (parts.length > 1 ? parts[parts.length - 1][0] : "") || "";
  return (first + last).toUpperCase();
}

function gradientFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  const h = Math.abs(hash) % 360;
  const h2 = (h + 28) % 360;
  const g1 = `hsl(${h} 64% 76%)`;
  const g2 = `hsl(${h2} 62% 70%)`;
  const fg = "#111";
  return { g1, g2, fg };
}

/* Defaults */
const TEAM = [
  {
    name: "Aisha Bello",
    role: "Head of Product",
    bio: "Design-led product strategist focusing on conversion & UX.",
  },
  {
    name: "John Miller",
    role: "Engineer",
    bio: "Front-end engineer — React, tooling, performance.",
  },
  {
    name: "Sarah Collins",
    role: "Designer",
    bio: "Visual & interaction designer — branding and UI.",
  },
  {
    name: "Mark Zhang",
    role: "Founder",
    bio: "Building developer tools and web products for SMBs.",
  },
];

const TECH = [
  "React",
  "Vite",
  "Tailwind CSS",
  "Vercel / Serverless",
  "remove.bg proxy",
  "browser-image-compression",
];

export default function About({
  company = "FreshMind Studio",
  short = "Clean image tooling for creators and teams — compress, remove backgrounds, export production-ready assets.",
  ownerBio = "I build fast, accessible websites and web apps using React, Vite, and Tailwind. I focus on performance, good UX, and serverless integrations (Vercel).",
  team = TEAM,
  tech = TECH,
}) {
  return (
    <main className="about-root bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-[1100px] mx-auto px-6 py-12">
        {/* HERO */}
        <header className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full px-3 py-1 text-xs font-medium mb-4 about-eyebrow">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--brand-yellow)" }}
              />
              <span>About</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight about-title">
              Built for clarity. Designed for speed.
            </h1>

            <p className="mt-6 max-w-[65ch] text-gray-700 about-lead">
              {short}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/contact" className="btn-primary btn">
                Work with us
              </a>
              <a href="#team" className="btn btn-ghost">
                Meet the team
              </a>
            </div>
          </div>

          {/* RIGHT: blue panel with glow + decorative shapes */}
          <div className="relative">
            <div className="about-panel-blue p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white">
                We build modern web experiences
              </h3>
              <p className="mt-3 text-white/90">{ownerBio}</p>

              <div className="mt-4 text-sm text-white/80">
                <strong>Approach:</strong> Product-first, accessible, and fast —
                iterative shipping with maintainable code.
              </div>
            </div>

            {/* decorative floating dot */}
            <div
              className="absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-40 blur-[28px]"
              aria-hidden
              style={{
                background:
                  "radial-gradient(circle, rgba(8,112,186,0.18), transparent 40%)",
              }}
            />
          </div>
        </header>

        {/* WHAT WE DO + WHY */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <article className="about-card white-card p-6 rounded-2xl">
            <h3 className="card-title">What we do</h3>
            <p className="card-copy mt-3">
              We build tools and experiences that empower creators and small
              teams to ship images and content faster — with lower bandwidth,
              better visuals, and fewer steps.
            </p>

            <ul className="mt-4 about-list space-y-2 text-sm text-gray-700">
              <li>• Client-side image compression to save bandwidth</li>
              <li>
                • Serverless remove.bg proxy for secure background removal
              </li>
              <li>
                • Production-ready exports (transparent PNG, optimized JPG/WebP)
              </li>
              <li>• Vercel-first architecture — fast builds & global scale</li>
            </ul>
          </article>

          <article className="about-card blue-accent-card p-6 rounded-2xl">
            <h3 className="card-title text-white">Why we care</h3>
            <p className="card-copy mt-3 text-white/95">
              Images are central to how products and creators connect with
              users. Our tools reduce friction — less waiting, smaller uploads,
              and reliable transparent outputs for commerce and content.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="feature-mini bg-white/6 p-3 rounded-lg">
                <strong className="text-white block">Privacy-first</strong>
                <div className="muted text-white/80 text-sm">
                  API keys kept server-side
                </div>
              </div>
              <div className="feature-mini bg-white/6 p-3 rounded-lg">
                <strong className="text-white block">Developer-friendly</strong>
                <div className="muted text-white/80 text-sm">
                  Modular hooks & serverless functions
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* TEAM */}
        <section id="team" className="mt-12">
          <h3 className="section-heading">Team</h3>
          <p className="muted mt-2 max-w-[70ch] text-gray-600">
            A small tight-knit group focused on product design, engineering, and
            performance.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, idx) => {
              const { g1, g2, fg } = gradientFromName(m.name || String(idx));
              const initials = initialsFromName(m.name || "");
              return (
                <article
                  key={m.name || idx}
                  className="team-card p-4 rounded-2xl"
                  tabIndex={0}
                  aria-label={`Team member ${m.name}`}
                >
                  <div className="flex gap-4 items-start">
                    <div
                      className="avatar relative flex-shrink-0 w-14 h-14 rounded-full items-center justify-center inline-flex"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${g1}, ${g2})`,
                        color: fg,
                        boxShadow: `0 12px 30px rgba(2,6,23,0.18), 0 0 32px rgba(8,112,186,0.06)`,
                      }}
                      aria-hidden
                    >
                      <span className="text-sm font-semibold">{initials}</span>
                      <span
                        className="avatar-ring absolute -inset-0.5 rounded-full"
                        aria-hidden
                      />
                    </div>

                    <div>
                      <div className="team-name text-[var(--text-strong)] font-semibold">
                        {m.name}
                      </div>
                      <div className="team-role muted text-sm text-gray-600">
                        {m.role}
                      </div>
                      <div className="team-bio mt-2 text-sm text-gray-700">
                        {m.bio}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* PROCESS */}
        <section className="mt-12">
          <h3 className="section-heading">Our process</h3>
          <p className="muted mt-2 max-w-[70ch] text-gray-600">
            Iterative, collaborative, and measurable — we ship something useful
            quickly and iterate.
          </p>

          <ol className="process-grid mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            {["Discover", "Design", "Build", "Iterate"].map((step, i) => (
              <li key={step} className="process-step p-4 rounded-2xl">
                <div className="process-number">{i + 1}</div>
                <h4 className="process-title mt-3 text-[var(--text-strong)] font-semibold">
                  {step}
                </h4>
                <p className="process-copy mt-2 text-gray-600">
                  {
                    {
                      Discover:
                        "Understand goals, constraints, and success metrics.",
                      Design:
                        "Rapid prototypes and visual design to validate concepts.",
                      Build:
                        "Ship incrementally with tests and performance tuning.",
                      Iterate:
                        "Collect feedback and improve with measurable outcomes.",
                    }[step]
                  }
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* TECH & CTA */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="card-title">Tech & integrations</h3>
            <p className="card-copy mt-2 text-gray-700">
              We use modern, well-supported tools to keep code small, fast, and
              maintainable.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {tech.map((t) => (
                <span
                  key={t}
                  className="tech-chip px-3 py-2 rounded-full bg-white/90 border border-gray-100 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <aside className="about-quote-panel p-6 rounded-2xl blue-glow-card">
            <h3 className="card-title text-white">Want to work together?</h3>
            <p className="card-copy mt-3 text-white/95">
              If you have an idea for a site, product, or integration — let’s
              talk. I’ll scope a plan and send a clear quote.
            </p>
            <div className="mt-4">
              <a className="btn-primary btn" href="/contact">
                Get a quote
              </a>
            </div>
          </aside>
        </section>

        <div className="mt-16 text-sm muted text-center text-gray-600">
          © {new Date().getFullYear()} {company} — built with modern stacks,
          privacy-first defaults, and clear UX.
        </div>
      </div>
    </main>
  );
}
