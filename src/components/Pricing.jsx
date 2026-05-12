import React from "react";

const Pricing = () => {
  return (
    <div>
      <section id="pricing" className="fm-st-pricing">
        <div className="fm-st-pricing-container">
          {/* HEADER */}
          <div className="fm-st-pricing-header">
            <span className="fm-st-features-badge">Simple Pricing</span>

            <h2>
              Flexible plans for creators,
              <span className="fm-st-highlight"> freelancers & businesses</span>
            </h2>

            <p>
              Start free and upgrade as your workflow grows. Focus Studio is
              designed to scale with creators, teams, and businesses of every
              size.
            </p>
          </div>

          {/* CARDS */}
          <div className="fm-st-pricing-grid">
            {/* STARTER */}
            <div className="fm-st-price-card fm-st-price-card-starter">
              <div className="fm-st-price-top">
                <span className="fm-st-price-label">Starter</span>

                <h3>Free</h3>

                <p>
                  Perfect for individuals testing tools and handling lightweight
                  projects.
                </p>
              </div>

              <div className="fm-st-price-line" />

              <ul className="fm-st-price-features">
                <li>✓ Image compression tools</li>
                <li>✓ Background remover access</li>
                <li>✓ Basic PDF utilities</li>
                <li>✓ Standard processing speed</li>
                <li>✓ Limited daily usage</li>
              </ul>

              <a href="/" className="fm-st-price-btn">
                Get Started
              </a>
            </div>

            {/* PRO */}
            <div className="fm-st-price-card fm-st-price-card-pro">
              {/* badge */}
              <div className="fm-st-price-badge">
                <span>Most Popular</span>
              </div>

              <div className="fm-st-price-top">
                <span className="fm-st-price-label">Pro</span>

                <h3>
                  $19<span>/month</span>
                </h3>

                <p>
                  Built for freelancers, creators, and growing businesses
                  needing more power and speed.
                </p>
              </div>

              <div className="fm-st-price-line" />

              <ul className="fm-st-price-features">
                <li>✓ Unlimited image processing</li>
                <li>✓ Faster AI-powered tools</li>
                <li>✓ Advanced PDF utilities</li>
                <li>✓ Premium export quality</li>
                <li>✓ Priority processing</li>
                <li>✓ Access to upcoming tools</li>
                <li>✓ Early feature releases</li>
              </ul>

              <a href="/" className="fm-st-price-btn fm-st-price-btn-primary">
                Start Pro Plan
              </a>
            </div>

            {/* BUSINESS */}
            <div className="fm-st-price-card fm-st-price-card-business">
              <div className="fm-st-price-top">
                <span className="fm-st-price-label">Business</span>

                <h3>
                  Custom<span>/team</span>
                </h3>

                <p>
                  For agencies and businesses managing larger workflows and
                  teams.
                </p>
              </div>

              <div className="fm-st-price-line" />

              <ul className="fm-st-price-features">
                <li>✓ Team collaboration features</li>
                <li>✓ Dedicated support</li>
                <li>✓ API & integrations</li>
                <li>✓ High-volume processing</li>
                <li>✓ Priority infrastructure</li>
                <li>✓ Enterprise-grade security</li>
              </ul>

              <a href="/" className="fm-st-price-btn">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
