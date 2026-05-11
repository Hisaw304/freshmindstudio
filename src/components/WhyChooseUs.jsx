import React from "react";

const WhyChooseUs = () => {
  return (
    <div>
      <section className="fm-st-why">
        <div className="fm-st-why-container">
          {/* HEADER */}
          <div className="fm-st-why-header">
            <span className="fm-st-features-badge">
              Why Choose Focus Studio
            </span>
            <h2>
              Built differently from typical
              <span className="fm-st-highlight"> online tools platforms</span>
            </h2>

            <p>
              We focus on creating tools that are simple to use, visually
              polished, and actually helpful for creators, freelancers, and
              modern businesses.
            </p>
          </div>

          {/* CARDS */}
          <div className="fm-st-why-grid">
            {/* FOCUS STUDIO */}
            <div className="fm-st-why-card fm-st-why-card-primary">
              <div className="fm-st-why-card-top">
                <h3>Focus Studio</h3>
              </div>

              <div className="fm-st-why-line" />

              <ul className="fm-st-why-list">
                <li>
                  <span className="fm-st-check">✓</span>
                  Modern and intuitive interface
                </li>

                <li>
                  <span className="fm-st-check">✓</span>
                  Fast cloud-based processing
                </li>

                <li>
                  <span className="fm-st-check">✓</span>
                  Tools designed for creators & teams
                </li>

                <li>
                  <span className="fm-st-check">✓</span>
                  Beautiful responsive experience
                </li>

                <li>
                  <span className="fm-st-check">✓</span>
                  Growing collection of smart utilities
                </li>

                <li>
                  <span className="fm-st-check">✓</span>
                  Clean downloads without distractions
                </li>

                <li>
                  <span className="fm-st-check">✓</span>
                  Optimized for speed and performance
                </li>

                <li>
                  <span className="fm-st-check">✓</span>
                  Premium experience without complexity
                </li>
              </ul>
            </div>

            {/* OTHERS */}
            <div className="fm-st-why-card fm-st-why-card-secondary">
              <div className="fm-st-why-card-top">
                <h3>Typical Tool Platforms</h3>
              </div>

              <div className="fm-st-why-line" />

              <ul className="fm-st-why-list">
                <li>
                  <span className="fm-st-check">✓</span>
                  Basic file processing tools
                </li>

                <li>
                  <span className="fm-st-check">✓</span>
                  Limited customization
                </li>

                <li>
                  <span className="fm-st-close">✕</span>
                  Outdated user experience
                </li>

                <li>
                  <span className="fm-st-close">✕</span>
                  Slow processing speeds
                </li>

                <li>
                  <span className="fm-st-close">✕</span>
                  Too many intrusive ads
                </li>

                <li>
                  <span className="fm-st-close">✕</span>
                  Cluttered dashboards
                </li>

                <li>
                  <span className="fm-st-close">✕</span>
                  Limited modern integrations
                </li>

                <li>
                  <span className="fm-st-close">✕</span>
                  Poor mobile optimization
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyChooseUs;
