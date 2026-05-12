import React from "react";
import CompressorModern from "../components/Compressor";
import RemoverModern from "../components/Remover";
import PdfTools from "../components/pdf/PdfTools";
import FooterCta from "../components/FooterCta";
import AiMediaTools from "../components/ai-media/AiMediaTools";

const Tools = () => {
  return (
    <div>
      <section className="fm-st-tools-hero">
        {/* OVERLAY */}
        <div className="fm-st-tools-hero-overlay" />

        {/* GRID */}
        <div className="fm-st-tools-hero-grid" />

        <div className="fm-st-tools-hero-container">
          <div className="fm-st-tools-hero-content">
            <div className="fm-st-about-hero-badge">
              <span>Creative Utilities</span>
            </div>

            <h1>
              Powerful tools for <span>modern workflows</span>
            </h1>

            <p>
              Explore a growing collection of fast, modern, and beautifully
              designed utilities built to simplify creative work, optimize
              files, and improve productivity online
            </p>
          </div>
        </div>
      </section>
      <CompressorModern />
      <RemoverModern />
      <PdfTools />
      <AiMediaTools />
      <FooterCta />
    </div>
  );
};

export default Tools;
