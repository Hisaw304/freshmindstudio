import React from "react";
import Hero from "../components/Hero";
import Compressor from "../components/Compressor";
import Remover from "../components/Remover";

import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Pricing from "../components/Pricing";
import ContactPage from "../components/Contact";
import Contact from "../components/Contact";
import PdfTools from "../components/pdf/PdfTools";
import FeaturesBenefits from "../components/FeaturesBenefits";
import FooterCta from "../components/FooterCta";
import StatsSection from "../components/StatsSection";

const Home = () => {
  return (
    <div>
      <Hero />
      <Compressor />
      <Remover />
      <PdfTools />
      <StatsSection />
      <FeaturesBenefits />
      <Testimonials />
      {/* <Pricing /> */}
      <FAQ />
      {/* <Contact /> */}
      <FooterCta />
    </div>
  );
};

export default Home;
