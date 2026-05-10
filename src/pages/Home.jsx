import React from "react";
import Hero from "../components/Hero";
import Compressor from "../components/Compressor";
import Remover from "../components/Remover";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Pricing from "../components/Pricing";
import ContactPage from "../components/Contact";
import Contact from "../components/Contact";
import PdfTools from "../components/pdf/PdfTools";

const Home = () => {
  return (
    <div>
      <Hero />
      <Compressor />
      <Remover />
      <PdfTools />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
    </div>
  );
};

export default Home;
