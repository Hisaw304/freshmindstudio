import React from "react";
import FooterCta from "../components/FooterCta";

const ContactPage = () => {
  return (
    <div>
      <section className="fm-st-about-hero">
        {/* GRID BG */}
        <div className="fm-st-about-hero-grid" />

        <div className="fm-st-about-hero-container">
          <div className="fm-st-about-hero-content">
            <div className="fm-st-about-hero-badge">
              <span>Contact Us</span>
            </div>

            <h1>
              Let’s build <span>something great</span>
            </h1>

            <p>
              Have a question, partnership idea, feature request, or just want
              to say hello? We’d love to hear from you. Reach out and our team
              will get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>
      <FooterCta />
    </div>
  );
};

export default ContactPage;
