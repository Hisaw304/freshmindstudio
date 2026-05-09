import React, { useEffect, useRef, useState } from "react";
import { compressFile } from "../../hooks/useImageCompressor";
import { fileToDataUrl } from "../../utils/toBase64";

/* ---------- helpers ---------- */
function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

async function dataUrlToFile(dataUrl, filename = "upload.png") {
  // handle both data: URIs and remote base64 URLs
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/png" });
  } catch (err) {
    console.warn("dataUrlToFile failed:", err);
    throw err;
  }
}

/* checkered wrapper (visual only) */
const Checkered = ({ children, className = "" }) => (
  <div className={`rm-checkered-wrapper ${className}`}>
    <div className="rm-checkered-inner">{children}</div>
  </div>
);

/* ---------- component ---------- */
export default function RemoverModern() {
  const [inputFile, setInputFile] = useState(null);
  const [inputDataUrl, setInputDataUrl] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [compressedDataUrl, setCompressedDataUrl] = useState(null);

  const [resultDataUrl, setResultDataUrl] = useState(null);
  const [bgMode, setBgMode] = useState("transparent");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImage, setBgImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compressBeforeSend, setCompressBeforeSend] = useState(true);
  const [error, setError] = useState(null);

  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const abortRef = useRef(null);
  const inputRef = useRef(null);
  const mountedRef = useRef(false);
  const liveRegionRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    const pre = sessionStorage.getItem("focusstudio:selectedImage");
    if (pre) {
      setInputDataUrl(pre);
    }
    return () => {
      mountedRef.current = false;
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (resultDataUrl) {
      generateFinalImage();
    }
  }, [bgMode, bgColor, bgImage, resultDataUrl]);

  /* FILE HANDLING */
  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type?.startsWith?.("image/")) {
      setError("Please upload an image file (jpg, png, webp).");
      return;
    }
    setError(null);
    setInputFile(file);
    setCompressedFile(null);
    setCompressedDataUrl(null);
    setResultDataUrl(null);
    setProgress(0);
    try {
      const durl = await fileToDataUrl(file);
      if (!mountedRef.current) return;
      setInputDataUrl(durl);
    } catch (err) {
      console.warn("read original failed", err);
      setError("Failed reading file.");
    }
  };

  /* DRAG HANDLERS */
  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer?.files);
  };

  /* compress if the user wants before sending */
  const maybeCompressBeforeSend = async () => {
    // no image selected
    if (!inputFile && !inputDataUrl) return null;

    if (!compressBeforeSend) {
      if (inputDataUrl) return inputDataUrl;
      if (inputFile) return await fileToDataUrl(inputFile);
      return null;
    }

    // compress File if we have one
    if (inputFile) {
      const options = {
        maxSizeMB: 1.0,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      };
      const compressed = await compressFile(inputFile, options);
      if (!mountedRef.current) return null;
      setCompressedFile(compressed);
      const cdurl = await fileToDataUrl(compressed);
      setCompressedDataUrl(cdurl);
      return cdurl;
    }

    // we only have data URL: convert to file then compress
    if (inputDataUrl) {
      try {
        const file = await dataUrlToFile(inputDataUrl, "upload.png");
        const options = {
          maxSizeMB: 1.0,
          maxWidthOrHeight: 1600,
          useWebWorker: true,
        };
        const compressed = await compressFile(file, options);
        if (!mountedRef.current) return null;
        setCompressedFile(compressed);
        const cdurl = await fileToDataUrl(compressed);
        setCompressedDataUrl(cdurl);
        return cdurl;
      } catch (err) {
        console.warn("compress from dataUrl failed:", err);
        return inputDataUrl;
      }
    }

    return null;
  };

  /* remove background (server-side) */
  const handleRemove = async () => {
    setError(null);
    if (!inputDataUrl && !inputFile) {
      setError("Please select or upload an image first.");
      return;
    }

    // abort previous in-flight
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }

    setLoading(true);
    setResultDataUrl(null);
    setProgress(6);

    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutMs = 60_000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const progressTimer = setInterval(() => {
      setProgress((p) => Math.min(92, p + Math.random() * 6));
    }, 220);

    try {
      const payloadBase64 = await maybeCompressBeforeSend();
      if (!payloadBase64) {
        setError("Unable to prepare image for sending.");
        return;
      }

      const res = await fetch("/api/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: payloadBase64 }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearInterval(progressTimer);
      setProgress(100);

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        const message = json?.error || `Remove failed (status ${res.status})`;
        if (res.status === 429) {
          setError(
            "Rate limit / quota exceeded — check your API key or try later."
          );
        } else {
          setError(message);
        }
        return;
      }

      const json = await res.json();
      if (!json?.imageBase64) {
        setError("Invalid response from server.");
        return;
      }

      setResultDataUrl(json.imageBase64);
      if (liveRegionRef.current)
        liveRegionRef.current.textContent = "Background removal complete.";
    } catch (err) {
      if (err?.name === "AbortError") {
        setError("Request cancelled or timed out.");
      } else {
        console.error("remove-bg error", err);
        setError(err?.message || "Background removal failed.");
      }
    } finally {
      clearInterval(progressTimer);
      setTimeout(() => setProgress(0), 600);
      setLoading(false);
      clearTimeout(timeoutId);
      abortRef.current = null;
    }
  };
  /* generate final composited image */

  const generateFinalImage = async (
    mode = bgMode,
    color = bgColor,
    image = bgImage
  ) => {
    if (!resultDataUrl) return;

    try {
      const fg = new Image();
      fg.src = resultDataUrl;

      await new Promise((resolve) => {
        fg.onload = resolve;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = fg.width;
      canvas.height = fg.height;

      /* transparent = nothing */

      if (mode === "color") {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (mode === "image" && image) {
        const bg = new Image();
        bg.src = image;

        await new Promise((resolve) => {
          bg.onload = resolve;
        });

        /* COVER BACKGROUND */

        const canvasRatio = canvas.width / canvas.height;
        const imageRatio = bg.width / bg.height;

        let drawWidth;
        let drawHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imageRatio > canvasRatio) {
          /* image wider */

          drawHeight = canvas.height;
          drawWidth = bg.width * (canvas.height / bg.height);

          offsetX = (canvas.width - drawWidth) / 2;
        } else {
          /* image taller */

          drawWidth = canvas.width;
          drawHeight = bg.height * (canvas.width / bg.width);

          offsetY = (canvas.height - drawHeight) / 2;
        }

        ctx.drawImage(bg, offsetX, offsetY, drawWidth, drawHeight);
      }

      /* foreground */

      ctx.drawImage(fg, 0, 0);

      const merged = canvas.toDataURL("image/png");

      setFinalImage(merged);
    } catch (err) {
      console.error(err);
      setError("Failed generating final image.");
    }
  };
  const handleBackgroundUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const durl = await fileToDataUrl(file);

      setBgImage(durl);

      setBgMode("image");
    } catch (err) {
      setError("Failed loading background image.");
    }
  };
  const handleDownloadResult = () => {
    const imageToDownload = finalImage || resultDataUrl;

    if (!imageToDownload) return;

    const a = document.createElement("a");

    a.href = imageToDownload;

    a.download =
      bgMode === "transparent"
        ? "focusstudio-transparent.png"
        : "focusstudio-edited.png";

    document.body.appendChild(a);

    a.click();

    a.remove();
  };

  const handleReset = () => {
    setInputFile(null);
    setInputDataUrl(null);
    setCompressedFile(null);
    setCompressedDataUrl(null);
    setResultDataUrl(null);
    setError(null);
    sessionStorage.removeItem("focusstudio:selectedImage");
  };

  const compressedRatio =
    inputFile && compressedFile
      ? Math.round(100 - (compressedFile.size / inputFile.size) * 100)
      : null;

  return (
    <section className="fm-rm">
      <div aria-live="polite" ref={liveRegionRef} className="sr-only" />

      {/* HEADER */}
      <div className="fm-rm-header">
        <h1>Background Remover</h1>

        <p>
          Upload an image and instantly remove the background with AI-powered
          processing. Clean transparent PNG exports ready for products,
          branding, thumbnails, social media, and more.
        </p>
      </div>
      <div className="fm-rm-layout">
        {/* SINGLE CARD */}
        <div
          className={`fm-rm-card ${dragActive ? "dragging" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {/* TOP AREA */}
          <div
            className={`fm-rm-dropzone ${dragActive ? "active" : ""}`}
            role="button"
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && inputRef.current?.click()
            }
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {!inputDataUrl && !resultDataUrl ? (
              <div className="fm-rm-empty">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  className="fm-rm-icon"
                >
                  <path
                    d="M12 3v10"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 12l4-4 4 4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M5 20h14"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>

                <h3>Drop your image here</h3>

                <p>
                  JPG, PNG, or WebP supported. AI will automatically remove the
                  background and return a transparent PNG.
                </p>

                <button type="button" className="fm-rm-upload-btn">
                  Choose Image
                </button>
              </div>
            ) : (
              <div className="fm-rm-preview-wrap">
                {/* BEFORE */}
                {!loading && !resultDataUrl && (
                  <img
                    src={inputDataUrl}
                    alt="Uploaded preview"
                    className="fm-rm-preview"
                  />
                )}

                {/* LOADING EFFECT */}
                {loading && (
                  <div className="fm-rm-processing">
                    <div className="fm-rm-image-stack">
                      <img
                        src={inputDataUrl}
                        alt="Processing"
                        className="fm-rm-preview"
                      />

                      {/* REMOVE.BG STYLE WIPE */}
                      <div className="fm-rm-wipe">
                        <img
                          src={inputDataUrl}
                          alt="Removing background"
                          className="fm-rm-preview"
                        />
                      </div>
                    </div>

                    <div className="fm-rm-loader" />

                    <span>Removing background...</span>
                  </div>
                )}

                {/* RESULT */}
                {!loading && resultDataUrl && (
                  <div className="fm-rm-result-wrap">
                    <div className="fm-rm-checker">
                      <img
                        src={finalImage || resultDataUrl}
                        alt="Background removed"
                        className="fm-rm-preview"
                      />
                    </div>

                    <div className="fm-rm-success">
                      Background removed successfully
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FILE INFO */}
          {inputFile && (
            <div className="fm-rm-file-info">
              <div>
                <h4>{inputFile.name}</h4>

                <p>
                  {formatBytes(inputFile.size)} • {inputFile.type}
                </p>
              </div>

              {compressedFile && (
                <div className="fm-rm-badge">
                  {compressedRatio != null
                    ? `${compressedRatio}% optimized`
                    : formatBytes(compressedFile.size)}
                </div>
              )}
            </div>
          )}

          {/* OPTIONS */}
          <div className="fm-rm-options">
            <label className="fm-rm-checkbox">
              <input
                type="checkbox"
                checked={compressBeforeSend}
                onChange={(e) => setCompressBeforeSend(e.target.checked)}
              />

              <span>Compress image before processing</span>
            </label>
          </div>

          {/* PROGRESS */}
          {progress > 0 && (
            <div className="fm-rm-progress">
              <div
                className="fm-rm-progress-bar"
                style={{ width: `${progress}%` }}
              />

              <span>{Math.round(progress)}%</span>
            </div>
          )}

          {/* ACTIONS */}
          <div className="fm-rm-actions">
            <button
              type="button"
              onClick={handleRemove}
              disabled={(!inputDataUrl && !inputFile) || loading}
              className="fm-rm-primary-btn"
            >
              {loading ? "Processing..." : "Remove Background"}
            </button>

            <button
              type="button"
              onClick={handleDownloadResult}
              disabled={!resultDataUrl}
              className="fm-rm-secondary-btn"
            >
              Download PNG
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="fm-rm-secondary-btn"
            >
              Reset
            </button>
          </div>

          {/* BACKGROUND CONTROLS */}

          <div className="fm-rm-background-tools">
            <h4>Replace Background</h4>

            <div className="fm-rm-bg-options">
              <button
                type="button"
                onClick={() => setBgMode("transparent")}
                className={bgMode === "transparent" ? "active" : ""}
              >
                Transparent
              </button>

              <button
                type="button"
                onClick={() => {
                  setBgMode("color");
                  setBgColor("#ffffff");
                }}
                className={bgMode === "color" ? "active" : ""}
              >
                Solid Color
              </button>

              <label className="fm-rm-bg-upload">
                Upload Background
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleBackgroundUpload}
                />
              </label>
            </div>

            {bgMode === "color" && (
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="fm-rm-color-picker"
              />
            )}
          </div>

          {/* ERROR */}
          {error && <div className="fm-rm-error">{error}</div>}
        </div>

        {/* RIGHT */}
        <div className="fm-rm-how-card">
          <div className="fm-rm-how-badge">AI Workflow</div>

          <h3>How it works</h3>

          <div className="fm-rm-how-steps">
            <div className="fm-rm-how-step">
              <div className="fm-rm-step-number">01</div>

              <div>
                <h4>Upload your image</h4>

                <p>Drag and drop or select any JPG, PNG, or WEBP image.</p>
              </div>
            </div>

            <div className="fm-rm-how-step">
              <div className="fm-rm-step-number">02</div>

              <div>
                <h4>AI removes background</h4>

                <p>
                  Advanced AI automatically detects and isolates the main
                  subject.
                </p>
              </div>
            </div>

            <div className="fm-rm-how-step">
              <div className="fm-rm-step-number">03</div>

              <div>
                <h4>Replace or customize</h4>

                <p>
                  Use transparent, solid color, or custom uploaded backgrounds.
                </p>
              </div>
            </div>

            <div className="fm-rm-how-step">
              <div className="fm-rm-step-number">04</div>

              <div>
                <h4>Download final image</h4>

                <p>
                  Export high-quality PNG images ready for branding, products,
                  thumbnails, social media, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
