// src/components/Footer.jsx

import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="fm-st-footer">
      {/* TOP */}
      <div className="fm-st-footer-top">
        {/* BRAND */}
        <div className="fm-st-footer-brand">
          <div className="fm-st-footer-logo-wrap">
            <h2>Focus Studio</h2>
            <span>- Creative SaaS Solutions -</span>
          </div>

          <p>
            Building modern SaaS tools that simplify workflows, improve
            productivity, and help businesses move faster online.
          </p>

          <div className="fm-st-footer-socials">
            <a href="#">
              <FaTwitter size={18} />
            </a>

            <a href="#">
              <FaInstagram size={18} />{" "}
            </a>

            <a href="#">
              <FaLinkedin size={18} />{" "}
            </a>

            <a href="#">
              <FaGithub size={18} />
            </a>
          </div>
        </div>

        {/* LINKS */}
        <div className="fm-st-footer-links">
          <div className="fm-st-footer-column">
            <h4>Navigation</h4>

            <a href="/">Home</a>
            <a href="/tools">Tools</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>

          <div className="fm-st-footer-column">
            <h4>Quick Links</h4>

            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#">Privacy Policy</a>
          </div>

          <div className="fm-st-footer-column">
            <h4>Tools</h4>

            <a href="#">Image Compressor</a>
            <a href="#">Background Remover</a>
            <a href="#">PDF Tools</a>
            <a href="#">AI Utilities</a>
          </div>
        </div>

        {/* CONTACT CARD */}
        <div className="fm-st-footer-contact">
          <div className="fm-st-footer-contact-card">
            <h4>Get In Touch</h4>

            <div className="fm-st-footer-contact-item">
              <Mail size={18} />
              <span>hello@focusstudio.com</span>
            </div>

            <div className="fm-st-footer-contact-item">
              <Phone size={18} />
              <span>+1 (860) 821-3853</span>
            </div>

            <div className="fm-st-footer-contact-item">
              <MapPin size={18} />
              <span>Laconia, New Hampshire</span>
            </div>

            <a href="/contact" className="fm-st-footer-btn">
              Start a Project
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="fm-st-footer-bottom">
        <p>© 2026 Focus Studio. All rights reserved.</p>

        <div className="fm-st-footer-bottom-links">
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
