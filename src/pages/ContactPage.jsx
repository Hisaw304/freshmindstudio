// src/pages/Contact.jsx
import React, { useEffect } from "react";

// Import the contact UI component you already created.
// If your component file/name differs, update this path/name accordingly.

import Contact from "../components/Contact";

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact — FreshMind Studio";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Page header / hero */}
      <header
        className="bg-gradient-to-r from-yellow-50 to-white py-16"
        aria-hidden={false}
      >
        <div className="max-w-[1100px] mx-auto px-4 text-center">
          <div
            id="contact"
            className="inline-flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1 text-xs font-medium text-gray-700 mb-4 mx-auto"
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: "var(--accent)" }}
            />
            Get in touch
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-[var(--text)]">
            Let’s build something great together
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Whether you need a clean marketing site, a fast e-commerce store, or
            a production-ready web app — FreshMind Studio helps you design,
            build, and ship with performance and clarity in mind. Describe your
            project below and I’ll get back within 1–2 business days.
          </p>
        </div>
      </header>

      {/* Main contact section (your component) */}
      <main className="flex-1">
        <div className=" mx-auto ">
          {/* The contact component should include the form, validation, success states, etc. */}
          <Contact />
        </div>

        {/* Short closing CTA + summary */}
        <section className="mt-12 bg-gray-50 py-10">
          <div className="max-w-[1100px] mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold text-[var(--text)]">
              Ready to start?
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              If you want to develop any kind of website — landing pages,
              portfolios, e-commerce stores, or complex web apps — I build fast,
              maintainable solutions using React, Vite, Tailwind and serverless
              APIs (Vercel). I focus on accessibility, performance, and a smooth
              handoff for future development.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <a
                href="#contact"
                className="btn-primary btn"
                aria-label="Start your project by email"
              >
                Start your project
              </a>

              <a href="/" className="btn btn-ghost" aria-label="Back to home">
                Back to home
              </a>
            </div>

            <div className="mt-6 text-sm text-gray-500">
              Or drop a quick message in the form above — attach files if you
              have mockups or examples. I do not store attachments publicly.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
