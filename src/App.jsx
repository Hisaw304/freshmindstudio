import React from "react";
import { Routes, Route } from "react-router-dom"; // use these instead of BrowserRouter
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import ContactPage from "./pages/ContactPage";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Add more routes here if needed */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
