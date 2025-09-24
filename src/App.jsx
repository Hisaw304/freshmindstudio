import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import ContactPage from "./pages/ContactPage";
import CryptoTipModal from "./components/CryptoTipModal";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Floating Global Tip Modal */}
      <div className="fixed bottom-6 right-6 z-50">
        <CryptoTipModal />
      </div>
    </div>
  );
};

export default App;
