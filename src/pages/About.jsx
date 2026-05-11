import React from "react";
import AboutSection from "../components/AboutSection";
import FooterCta from "../components/FooterCta";
import WhyChooseUs from "../components/WhyChooseUs";

const About = () => {
  return (
    <div>
      <section>
        <div className="fm-st-about-hero">
          {/* GRID BG */}
          <div className="fm-st-about-hero-grid" />

          <div className="fm-st-about-hero-container">
            <div className="fm-st-about-hero-content">
              <div className="fm-st-about-hero-badge">
                <span>About Focus Studio</span>
              </div>

              <h1>
                Hello! We are <span>Focus Studio</span>
              </h1>

              <p>
                We build modern creative utilities designed to simplify digital
                workflows, improve productivity, and help creators move faster
                online. From image optimization to future AI-powered tools, our
                goal is to make powerful web experiences feel simple, fast, and
                beautifully designed.
              </p>
            </div>
          </div>
        </div>
        <AboutSection />
        <WhyChooseUs />
        <FooterCta />
      </section>
    </div>
  );
};

export default About;
