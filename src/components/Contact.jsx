import React, { useEffect, useRef, useState } from "react";
import { fileToDataUrl } from "../../utils/toBase64";

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

  return (
    <main className="cm-roots">
      <div aria-live="polite" ref={liveRef} className="sr-only" />

      {/* subtle background accents */}
      <div className="cm-bg-accents" aria-hidden />

      <div className="cm-containers">
        <div className="cm-grids">
          {/* FORM */}
          <section
            aria-labelledby="contact-title"
            className="cm-cards cm-forms"
          >
            <div className="cm-heds">
              <div className="cm-eyebrows">
                <span className="cm-dots" aria-hidden />
                Get in touch
              </div>

              <h1 id="contact-titles" className="cm-titles ">
                Start your project
              </h1>
              <p className="cm-subs">
                Tell me about your project and I'll reply within 1–2 business
                days. Prefer a call? Leave your phone number in the message.
              </p>
            </div>

            {/* status / toast */}
            <div className="cm-statuss">
              {error && (
                <div role="alert" className="cm-alerts cm-alert-errors">
                  {error}
                </div>
              )}
              {toast && (
                <div role="status" className="cm-alerts cm-alert-infos">
                  {toast}
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="cm-form-bodys" noValidate>
              <div className="cm-rows cm-twos">
                <label className="cm-fields">
                  <span className="cm-labels">
                    Name{" "}
                    <span aria-hidden className="cm-requireds">
                      *
                    </span>
                  </span>
                  <input
                    className="cm-inputs"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    required
                    aria-required
                  />
                </label>

                <label className="cm-fields">
                  <span className="cm-labels">
                    Email{" "}
                    <span aria-hidden className="cm-requireds">
                      *
                    </span>
                  </span>
                  <input
                    className="cm-inputs"
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    required
                    aria-required
                  />
                </label>
              </div>

              <div className="cm-rows cm-twos">
                <label className="cm-fields">
                  <span className="cm-labels">Company (optional)</span>
                  <input
                    className="cm-inputs"
                    value={form.company}
                    onChange={(e) => setField("company", e.target.value)}
                  />
                </label>

                <label className="cm-fields">
                  <span className="cm-labels">Service</span>
                  <select
                    className="cm-inputs"
                    value={form.service}
                    onChange={(e) => setField("service", e.target.value)}
                  >
                    <option>Website (Landing/Marketing)</option>
                    <option>E-commerce store</option>
                    <option>Web app / Dashboard</option>
                    <option>Portfolio / Personal site</option>
                    <option>Integrations / API</option>
                    <option>Other / Custom</option>
                  </select>
                </label>
              </div>

              <label className="cm-fields">
                <span className="cm-labels">Budget (optional)</span>
                <select
                  className="cm-input"
                  value={form.budget}
                  onChange={(e) => setField("budget", e.target.value)}
                >
                  <option value="">Select budget</option>
                  <option value="<$500">&lt;$500</option>
                  <option value="$500–$2k">$500–$2k</option>
                  <option value="$2k–$10k">$2k–$10k</option>
                  <option value=">$10k">&gt;$10k</option>
                </select>
              </label>

              <label className="cm-fields">
                <span className="cm-labels">
                  Message{" "}
                  <span aria-hidden className="cm-requireds">
                    *
                  </span>
                </span>
                <textarea
                  className="cm-inputs cm-textareas"
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  required
                />
              </label>

              {/* attachment dropzone */}
              <div
                ref={dropRef}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                data-drag="false"
                className="cm-dropzoness"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileRef.current?.click();
                  }
                }}
                aria-label="Attachment area - drop file or press Enter to choose"
              >
                <input
                  ref={fileRef}
                  type="file"
                  className="sr-only"
                  onChange={(e) => handleFileChange(e.target.files)}
                />
                <div className="cm-drop-inners">
                  <div className="cm-drop-texts">
                    Drag & drop an image or click to choose (max{" "}
                    {formatBytes(MAX_ATTACHMENT_BYTES)})
                  </div>
                  <div className="cm-drop-actions">
                    <button
                      type="button"
                      className="cm-btn-ghosts"
                      onClick={() => fileRef.current?.click()}
                    >
                      Choose file
                    </button>
                    {attachmentPreview && (
                      <button
                        type="button"
                        className="cm-btn-links"
                        onClick={removeAttachment}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="cm-drop-previews">
                  {attachmentPreview ? (
                    <div className="cm-preview-rows">
                      {attachmentPreview.dataUrl ? (
                        <img
                          src={attachmentPreview.dataUrl}
                          alt={attachmentPreview.name}
                          className="cm-thumbs"
                        />
                      ) : (
                        <div className="cm-thumbs cm-thumb-files">
                          {attachmentPreview.name.split(".").pop()}
                        </div>
                      )}
                      <div className="cm-preview-metas">
                        <div className="cm-preview-names">
                          {attachmentPreview.name}
                        </div>
                        <div className="cm-preview-sizes">
                          {formatBytes(attachmentPreview.size)}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* actions */}
              <div className="cm-actions">
                <button
                  type="submit"
                  className="cm-ctas"
                  disabled={sending}
                  aria-busy={sending}
                >
                  {sending ? (
                    <span className="cm-cta-inners">
                      <svg
                        className="cm-spinners"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeOpacity="0.15"
                          fill="none"
                        />
                        <path
                          d="M22 12a10 10 0 00-10-10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    "Send message"
                  )}
                </button>

                <button
                  type="button"
                  className="cm-btn-outlines"
                  onClick={() => {
                    setForm({
                      name: "",
                      email: "",
                      company: "",
                      service: "Website (Landing/Marketing)",
                      budget: "",
                      message: "",
                    });
                    removeAttachment();
                    setError(null);
                  }}
                  disabled={sending}
                >
                  Reset
                </button>

                {uploadPercent > 0 && (
                  <div className="cm-progresss" aria-hidden>
                    <div
                      className="cm-progress-bars"
                      style={{ width: `${uploadPercent}%` }}
                    />
                    <div className="cm-progress-labels">{uploadPercent}%</div>
                  </div>
                )}
              </div>
            </form>
          </section>

          {/* DETAILS */}
          <aside className="cm-sides">
            <div className="cm-cards cm-side-cards">
              <h3 className="cm-side-titles">Contact details</h3>

              <ul className="cm-info-lists">
                <li>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${ownerEmail}`}>{ownerEmail}</a>
                </li>
                <li>
                  <strong>Location:</strong> {ownerLocation}
                </li>
                <li>
                  <strong>Response time:</strong> 1–2 business days
                </li>
              </ul>

              <hr className="cm-dividers" />

              <h4 className="cm-side-subs">
                If you want to develop any kind of website
              </h4>
              <p className="cm-side-bios">{ownerBio}</p>

              <div className="cm-socials">
                <a href="#" aria-label="Twitter">
                  Twitter
                </a>
                <a href="#" aria-label="LinkedIn">
                  LinkedIn
                </a>
                <a href="#" aria-label="GitHub">
                  GitHub
                </a>
              </div>
            </div>

            <div className="cm-notes">
              By contacting me you agree to share the project details required
              to provide a quote. Attachments will never be published.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
