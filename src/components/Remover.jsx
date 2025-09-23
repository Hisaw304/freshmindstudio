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
    const pre = sessionStorage.getItem("freshmind:selectedImage");
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
        return inputDataUrl; // fallback
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

  const handleDownloadResult = () => {
    if (!resultDataUrl) return;
    const a = document.createElement("a");
    a.href = resultDataUrl;
    a.download = "freshmind-removed.png";
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
    sessionStorage.removeItem("freshmind:selectedImage");
  };

  const compressedRatio =
    inputFile && compressedFile
      ? Math.round(100 - (compressedFile.size / inputFile.size) * 100)
      : null;

  return (
    <section className="rm-root max-w-6xl mx-auto px-6 py-10">
      <div aria-live="polite" ref={liveRegionRef} className="sr-only" />

      <header className="mb-6">
        <h1 id="remover" className="text-2xl font-extrabold text-[var(--text)]">
          Background Remover
        </h1>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-[70ch]">
          Upload or paste an image and remove its background. We proxy calls to
          remove.bg (server-side).
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div
            className={`rm-card rounded-2xl p-3 transition ${
              dragActive ? "rm-card--drag" : ""
            }`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            role="region"
            aria-label="Upload image"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") &&
                inputRef.current?.click()
              }
              className={`rm-dropzone flex flex-col items-center justify-center gap-3 h-40 rounded-lg cursor-pointer ${
                dragActive ? "rm-dropzone--active" : ""
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files)}
              />

              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                className="rm-icon"
                aria-hidden
                focusable="false"
              >
                <path
                  d="M12 3v10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.5 16.5V7.5A2.5 2.5 0 0018 5h-3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.5 13.5v3A2.5 2.5 0 006 19h12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12l4-4 4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="text-sm font-semibold text-[var(--text)]">
                Drop or choose an image
              </div>
              <div className="text-xs text-[var(--muted)]">
                Transparent PNG output • remove.bg limits apply
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="rm-btn rm-btn-pill mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
              >
                Select file
              </button>
            </div>
          </div>

          <div className="rm-card rounded-2xl p-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={compressBeforeSend}
                onChange={(e) => setCompressBeforeSend(e.target.checked)}
              />
              <span className="text-sm">
                Compress before sending (recommended)
              </span>
            </label>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleRemove}
                disabled={(!inputDataUrl && !inputFile) || loading}
                className="rm-btn rm-btn-primary flex-1 px-4 py-2 rounded-md font-semibold disabled:opacity-60"
              >
                {loading ? "Processing…" : "Remove Background"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="rm-btn rm-btn-ghost px-3 py-2 rounded-md border"
              >
                Reset
              </button>

              {loading && (
                <button
                  type="button"
                  onClick={() => {
                    if (abortRef.current) abortRef.current.abort();
                    setLoading(false);
                  }}
                  className="rm-btn rm-btn-ghost px-3 py-2 rounded-md border"
                >
                  Cancel
                </button>
              )}
            </div>

            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

            <div className="mt-3" aria-hidden={progress === 0}>
              <div className="h-2 rounded-full bg-[rgba(0,0,0,0.06)] overflow-hidden">
                <div
                  className="rm-progress-bar"
                  style={{
                    width: `${progress}%`,
                    transition: "width 220ms linear",
                    background:
                      "linear-gradient(90deg, var(--accent), rgba(var(--brand-yellow-rgb),0.85))",
                    height: "100%",
                  }}
                />
              </div>
              {progress > 0 && (
                <div className="text-xs text-[var(--muted)] mt-1">
                  {Math.round(progress)}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Previews */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Input preview */}
          <div>
            <div className="text-xs text-[var(--muted)] mb-2">Input</div>
            <div className="rm-card rounded-2xl p-4">
              <div className="h-56 rounded-md overflow-hidden flex items-center justify-center rm-image-area">
                {inputDataUrl ? (
                  <img
                    src={inputDataUrl}
                    alt="uploaded input"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">No image selected</div>
                )}
              </div>

              <div className="mt-3 text-sm text-[var(--text)]">
                {inputFile ? (
                  <>
                    <div className="font-semibold">{inputFile.name}</div>
                    <div className="text-xs text-[var(--muted)]">
                      {formatBytes(inputFile.size)} • {inputFile.type}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-[var(--muted)]">
                    Uploaded or preloaded image
                  </div>
                )}

                {compressedFile && (
                  <div className="rm-badge mt-2">
                    {compressedRatio != null
                      ? `${compressedRatio}% smaller`
                      : `${formatBytes(compressedFile.size)}`}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Result area (wide) */}
          <div className="md:col-span-2 rm-card">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-[var(--muted)]">Result</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rm-btn rm-btn-ghost px-3 py-1 text-sm"
                  onClick={handleDownloadResult}
                  disabled={!resultDataUrl}
                >
                  Download
                </button>
              </div>
            </div>

            <Checkered>
              <div style={{ width: "100%" }}>
                {loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="rm-loader" aria-hidden />
                    <div className="text-sm text-[var(--muted)]">
                      Processing with remove.bg…
                    </div>
                  </div>
                ) : resultDataUrl ? (
                  <img
                    src={resultDataUrl}
                    alt="result with background removed"
                    className="w-full h-56 object-contain"
                  />
                ) : (
                  <div className="h-56 flex items-center justify-center text-[var(--muted)]">
                    Result will appear here
                  </div>
                )}
              </div>
            </Checkered>
          </div>
        </div>

        <div className="mt-4 text-sm text-[var(--muted)]">
          Tip: Clear backgrounds and distinct subjects (product shots /
          portraits) yield the best results.
        </div>
      </div>
    </section>
  );
}
