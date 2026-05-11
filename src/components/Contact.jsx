import React, { useEffect, useRef, useState } from "react";
import { fileToDataUrl } from "../../utils/toBase64";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

/* ---------- config ---------- */
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024; // 4 MB
const UPLOAD_ENDPOINT = "/api/contact";

/* ---------- helpers ---------- */
function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
const validateEmail = (v) => /^\S+@\S+\.\S+$/.test(v);

function postFormDataWithProgress(url, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.withCredentials = false;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && typeof onProgress === "function") {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      try {
        const json = xhr.responseText ? JSON.parse(xhr.responseText) : {};
        if (xhr.status >= 200 && xhr.status < 300) resolve(json);
        else reject({ status: xhr.status, json });
      } catch (err) {
        reject(err);
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(formData);
  });
}

/* ---------- component ---------- */
export default function Contact({
  ownerName = "FreshMind Studio",
  ownerEmail = "hello@freshmind.studio",
  ownerLocation = "Remote",
  ownerBio = "I build fast, accessible websites and web apps using React, Vite, and Tailwind. I focus on performance, good UX, and serverless integrations (Vercel).",
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "Website (Landing/Marketing)",
    budget: "",
    message: "",
  });

  const [attachment, setAttachment] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  const fileRef = useRef(null);
  const liveRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  const setField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  /* file handlers */
  const handleFileChange = async (files) => {
    const f = files?.[0];
    if (!f) return;
    if (f.size > MAX_ATTACHMENT_BYTES) {
      setError(
        `Attachment too big — limit ${formatBytes(MAX_ATTACHMENT_BYTES)}.`
      );
      return;
    }
    setError(null);
    setAttachment(f);

    if (f.type?.startsWith("image/")) {
      try {
        const durl = await fileToDataUrl(f);
        setAttachmentPreview({ name: f.name, size: f.size, dataUrl: durl });
      } catch (err) {
        console.warn("preview failed", err);
        setAttachmentPreview({ name: f.name, size: f.size });
      }
    } else {
      setAttachmentPreview({ name: f.name, size: f.size });
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentPreview(null);
    if (fileRef.current) fileRef.current.value = null;
  };

  /* drag & drop (keyboard accessible) */
  const onDragOver = (e) => {
    e.preventDefault();
    if (dropRef.current) dropRef.current.dataset.drag = "true";
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    if (dropRef.current) dropRef.current.dataset.drag = "false";
  };
  const onDrop = (e) => {
    e.preventDefault();
    if (dropRef.current) dropRef.current.dataset.drag = "false";
    handleFileChange(e.dataTransfer?.files);
  };

  /* mailto fallback */
  const fallbackMailto = (payload) => {
    const subject = encodeURIComponent(
      `Project inquiry: ${payload.service} — ${payload.name || "No name"}`
    );
    const shortMessage = (payload.message || "").slice(0, 1200);
    let body = `Hi ${ownerName},%0D%0A%0D%0A${encodeURIComponent(
      shortMessage
    )}%0D%0A%0D%0A`;
    body += `Name: ${encodeURIComponent(
      payload.name || "-"
    )}%0D%0AEmail: ${encodeURIComponent(payload.email || "-")}%0D%0A`;
    body += `Company: ${encodeURIComponent(
      payload.company || "-"
    )}%0D%0ABudget: ${encodeURIComponent(payload.budget || "-")}%0D%0A`;
    if (payload.attachmentName)
      body += `%0D%0AAttachment: ${encodeURIComponent(
        payload.attachmentName
      )} (not attached)`;
    window.location.href = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
  };

  async function onSubmit(e) {
    e?.preventDefault();
    setError(null);
    setToast(null);

    if (!form.name?.trim()) return setError("Please enter your name.");
    if (!validateEmail(form.email))
      return setError("Please enter a valid email.");
    if (!form.message?.trim() || form.message.trim().length < 10)
      return setError("Please include a brief description (10+ characters).");

    setSending(true);
    setUploadPercent(0);

    const payloadBase = { ...form, time: new Date().toISOString() };

    try {
      if (attachment) {
        const fd = new FormData();
        Object.keys(payloadBase).forEach((k) => fd.append(k, payloadBase[k]));
        fd.append("attachment", attachment, attachment.name);

        await postFormDataWithProgress(UPLOAD_ENDPOINT, fd, (p) =>
          setUploadPercent(p)
        );

        setToast("Message sent — thanks!");
        setForm({
          name: "",
          email: "",
          company: "",
          service: "Website (Landing/Marketing)",
          budget: "",
          message: "",
        });
        removeAttachment();
        if (liveRef.current) liveRef.current.textContent = "Contact form sent";
      } else {
        const res = await fetch(UPLOAD_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBase),
        });

        if (!res.ok) {
          console.warn("contact API error", res.status);
          fallbackMailto(payloadBase);
          setToast("No server available — opened your mail client.");
          setForm({
            name: "",
            email: "",
            company: "",
            service: "Website (Landing/Marketing)",
            budget: "",
            message: "",
          });
          if (liveRef.current)
            liveRef.current.textContent = "Mail client opened as fallback";
        } else {
          setToast("Message sent — thanks!");
          setForm({
            name: "",
            email: "",
            company: "",
            service: "Website (Landing/Marketing)",
            budget: "",
            message: "",
          });
          if (liveRef.current)
            liveRef.current.textContent = "Contact form sent";
        }
      }
    } catch (err) {
      console.warn("submit error", err);
      try {
        fallbackMailto({ ...payloadBase, attachmentName: attachment?.name });
        setToast("Network/server error — opened mail client as fallback.");
        removeAttachment();
      } catch (e) {
        setError("Send failed. Please try again or email directly.");
      }
    } finally {
      setSending(false);
      setUploadPercent(0);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Grab inputs from state
    const formData = { name, email, company, service, budget, message };

    // 2. Handle attachments (convert File -> base64)
    const attachments = [];
    for (const file of selectedFiles) {
      const base64 = await toBase64(file);
      attachments.push({
        content: base64.split(",")[1], // remove "data:...base64,"
        filename: file.name,
        type: file.type,
        disposition: "attachment",
      });
    }

    // 3. Send to API
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, attachments }),
    });
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
            <form className="fm-st-contact-form">
              {/* ROW */}
              <div className="fm-st-contact-row">
                <div className="fm-st-contact-group">
                  <label>Name</label>
                  <input type="text" placeholder="Aaron Joel" />
                </div>

                <div className="fm-st-contact-group">
                  <label>Email</label>
                  <input type="email" placeholder="aaronjoel@example.com" />
                </div>
              </div>

              {/* ROW */}
              <div className="fm-st-contact-row">
                <div className="fm-st-contact-group">
                  <label>Company</label>
                  <input type="text" placeholder="Your company" />
                </div>

                <div className="fm-st-contact-group">
                  <label>Service</label>
                  <select>
                    <option>General Inquiry</option>
                    <option>Website Design</option>
                    <option>Full Stack Development</option>
                    <option>SaaS Platform</option>
                    <option>UI/UX Design</option>
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
                  placeholder="Tell us about your project..."
                />
              </div>

              {/* DROPZONE */}
              <div className="fm-st-contact-upload">
                <div className="fm-st-contact-upload-inner">
                  <h4>Drop files here</h4>

                  <p>
                    Upload screenshots, references, or project assets to help us
                    understand your request.
                  </p>

                  <button type="button">Choose File</button>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="fm-st-contact-actions">
                <button className="fm-st-contact-primary">Send Message</button>
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
