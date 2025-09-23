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

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Compressor Tool */}
      <section id="compressor" className="py-16">
        <div className="container mx-auto px-4">
          <Compressor />
        </div>
      </section>

      {/* Remover Tool */}
      <section id="remover" className="py-16 ">
        <div className="container mx-auto px-4">
          <Remover />
        </div>
      </section>

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
