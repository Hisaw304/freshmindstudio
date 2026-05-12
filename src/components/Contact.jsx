import React, { useRef, useState } from "react";

export default function Contact() {
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "General Inquiry",
    message: "",
  });

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* =========================
     HANDLE CHANGE
  ========================= */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     FILE
  ========================= */

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (selected) {
      setFile(selected);
    } else {
      setFile(null);
    }
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const body = new FormData();

      body.append("name", form.name);
      body.append("email", form.email);
      body.append("company", form.company);
      body.append("service", form.service);
      body.append("message", form.message);

      if (file) {
        body.append("file", file);
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess("Message sent successfully.");

      setForm({
        name: "",
        email: "",
        company: "",
        service: "General Inquiry",
        message: "",
      });

      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fm-st-contact">
      <div className="fm-st-contact-container">
        <div className="fm-st-contact-grid">
          {/* FORM SIDE */}
          <div className="fm-st-contact-card fm-st-contact-form-card">
            {/* HEADER */}
            <div className="fm-st-contact-header">
              <div className="fm-st-section-tag">
                <span>Get in touch</span>
              </div>

              <h2>
                Start your next
                <span className="fm-st-highlight"> creative project</span>
              </h2>

              <p>
                Tell us about your project, idea, or workflow needs. We’ll get
                back to you as soon as possible with the best solution.
              </p>
            </div>

            {/* FORM */}
            <form className="fm-st-contact-form" onSubmit={handleSubmit}>
              {/* ROW */}
              <div className="fm-st-contact-row">
                <div className="fm-st-contact-group">
                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Aaron Joel"
                    required
                  />
                </div>

                <div className="fm-st-contact-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="aaronjoel@example.com"
                    required
                  />
                </div>
              </div>

              {/* ROW */}
              <div className="fm-st-contact-row">
                <div className="fm-st-contact-group">
                  <label>Company</label>

                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your company"
                  />
                </div>

                <div className="fm-st-contact-group">
                  <label>Service</label>

                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                  >
                    <option>General Inquiry</option>

                    <option>Website Design</option>

                    <option>Full Stack Web Development</option>

                    <option>SaaS Platform</option>

                    <option>Creative Collaboration</option>

                    <option>Business Partnership</option>

                    <option>Custom Project</option>
                  </select>
                </div>
              </div>

              {/* MESSAGE */}
              <div className="fm-st-contact-group">
                <label>Message</label>

                <textarea
                  rows="7"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project..."
                  required
                />
              </div>

              {/* FILE INPUT */}
              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                hidden
              />

              {/* DROPZONE */}
              <div className="fm-st-contact-upload">
                <div className="fm-st-contact-upload-inner">
                  <h4>Drop files here</h4>

                  <p>
                    Upload screenshots, references, or project assets to help us
                    understand your request.
                  </p>

                  <button type="button" onClick={() => fileRef.current.click()}>
                    Choose File
                  </button>

                  {file && (
                    <p className="fm-st-file-name">Selected: {file.name}</p>
                  )}
                </div>
              </div>

              {/* SUCCESS */}
              {success && <div className="fm-st-success">{success}</div>}

              {/* ERROR */}
              {error && <div className="fm-st-error">{error}</div>}

              {/* ACTIONS */}
              <div className="fm-st-contact-actions">
                <button
                  type="submit"
                  className="fm-st-contact-primary"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE */}
          <aside className="fm-st-contact-sidebar">
            {/* CARD */}
            <div className="fm-st-contact-card">
              <h3>Contact Information</h3>

              <div className="fm-st-contact-info-list">
                <div className="fm-st-contact-info-item">
                  <span>Email</span>

                  <p>hello@focusstudio.com</p>
                </div>

                <div className="fm-st-contact-info-item">
                  <span>Location</span>

                  <p>Remote • Worldwide</p>
                </div>

                <div className="fm-st-contact-info-item">
                  <span>Response Time</span>

                  <p>Usually within 24 hours</p>
                </div>
              </div>
            </div>

            {/* CARD */}
            <div className="fm-st-contact-card">
              <h3>What we help with</h3>

              <ul className="fm-st-contact-list">
                <li>Modern SaaS platforms</li>

                <li>Creative online tools</li>

                <li>Fast, responsive, conversion-focused websites</li>

                <li>Responsive UI systems</li>

                <li>Full-stack web development</li>

                <li>Custom dashboards & internal utilities</li>

                <li>Scalable UI systems for growing brands</li>

                <li>Website updates, redesigns & revamps</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
