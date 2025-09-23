import React, { useEffect, useRef, useState } from "react";
import { compressFile } from "../../hooks/useImageCompressor";
import { fileToDataUrl } from "../../utils/toBase64";

/* helpers */
function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * CompressorModern — polished, accent-forward UI
 */
export default function CompressorModern() {
  const [originalFile, setOriginalFile] = useState(null);
  const [originalDataUrl, setOriginalDataUrl] = useState(null);

  const [compressedFile, setCompressedFile] = useState(null);
  const [compressedDataUrl, setCompressedDataUrl] = useState(null);

  const [preset, setPreset] = useState("medium"); // small | medium | large
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1600);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0..100
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const inputRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const mountedRef = useRef(false);
  const liveRegionRef = useRef(null);

  const presets = {
    small: { maxSizeMB: 0.5, mw: 1200 },
    medium: { maxSizeMB: 1.0, mw: 1600 },
    large: { maxSizeMB: 2.5, mw: 2400 },
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearInterval(progressIntervalRef.current);
    };
  }, []);

  /* File handling */
  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type?.startsWith?.("image/")) {
      setError("Please upload an image file (jpg, png, webp).");
      return;
    }
    setError(null);
    setOriginalFile(file);
    setCompressedFile(null);
    setCompressedDataUrl(null);
    setProgress(0);
    try {
      const durl = await fileToDataUrl(file);
      if (!mountedRef.current) return;
      setOriginalDataUrl(durl);
    } catch (err) {
      console.warn("read original failed", err);
      setError("Failed reading file.");
    }
  };

  /* Drag handlers */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer?.files);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  /* Compression with a smooth progress UI (synthetic) */
  const handleCompress = async () => {
    if (!originalFile) {
      setError("Please select an image first.");
      return;
    }
    setError(null);
    setLoading(true);
    setProgress(4); // start

    progressIntervalRef.current = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(96, p + Math.random() * 6);
        return next;
      });
    }, 220);

    const options = {
      maxSizeMB: presets[preset].maxSizeMB,
      maxWidthOrHeight: maxWidthOrHeight || presets[preset].mw,
      useWebWorker: true,
    };

    try {
      const result = await compressFile(originalFile, options);
      clearInterval(progressIntervalRef.current);
      setProgress(100);

      setCompressedFile(result || null);
      try {
        const durl = await fileToDataUrl(result);
        if (mountedRef.current) setCompressedDataUrl(durl || null);

        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = "Compression completed";
        }
      } catch (err) {
        console.warn("failed to create data url for compressed file", err);
      }
    } catch (err) {
      console.error("compress error", err);
      setError("Compression failed — check console for details.");
      clearInterval(progressIntervalRef.current);
      setProgress(0);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (mountedRef.current) setProgress(0);
      }, 800);
    }
  };

  const handleDownload = () => {
    const file = compressedFile || originalFile;
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    const ext = file.name?.split(".").pop() || "png";
    a.href = url;
    a.download = `freshmind-compressed.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleUseInRemover = () => {
    const durl = compressedDataUrl || originalDataUrl;
    if (!durl) {
      setError("Please compress or select an image first.");
      return;
    }
    try {
      sessionStorage.setItem("freshmind:selectedImage", durl);
      // navigate to remover
      if (typeof window !== "undefined") window.location.href = "#remover";
    } catch (err) {
      setError("Failed to use image in remover.");
    }
  };

  /* UI helpers */
  const compressionRatio =
    originalFile && compressedFile
      ? Math.round(100 - (compressedFile.size / originalFile.size) * 100)
      : null;

  return (
    <section className="compressor max-w-6xl mx-auto px-6 py-10">
      <div aria-live="polite" ref={liveRegionRef} className="sr-only" />

      <header className="mb-8">
        <h1 className="text-2xl font-extrabold text-[var(--text)]">
          Image Compressor
        </h1>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-[70ch]">
          Compress images client-side — keep quality, reduce upload times, and
          prepare for background removal.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: controls */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* Dropzone card */}
          <div
            className={`cm-card  rounded-2xl p-4 transition ${
              dragActive ? "cm-card--drag" : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            role="region"
            aria-label="Upload image"
          >
            <div
              tabIndex={0}
              role="button"
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  inputRef.current?.click();
              }}
              className={`cm-dropzone flex flex-col items-center justify-center gap-3 w-full h-44 rounded-lg cursor-pointer ${
                dragActive ? "cm-dropzone--active" : ""
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
                className="cm-icon"
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
                JPG • PNG • WebP
              </div>

              <button
                type="button"
                className="cm-btn cm-btn-pill mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Select file
              </button>
            </div>
          </div>

          {/* Presets (pills) */}
          <div className="cm-card rounded-2xl p-4">
            <label className="text-sm font-medium text-[var(--muted)]">
              Preset
            </label>
            <div className="mt-3 flex gap-2">
              {["small", "medium", "large"].map((p) => {
                const active = p === preset;
                return (
                  <button
                    key={p}
                    onClick={() => {
                      setPreset(p);
                      setMaxWidthOrHeight(presets[p].mw);
                    }}
                    className={`cm-pill ${active ? "cm-pill--active" : ""}`}
                    aria-pressed={active}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-[var(--muted)]">
                Max dimension
              </label>
              <input
                type="number"
                min="200"
                step="100"
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm bg-transparent text-[var(--text)]"
                value={maxWidthOrHeight}
                onChange={(e) =>
                  setMaxWidthOrHeight(
                    Number(e.target.value || presets.medium.mw)
                  )
                }
              />
              <div className="text-xs text-[var(--muted)] mt-2">
                Target: <strong>{presets[preset].maxSizeMB} MB</strong>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleCompress}
                disabled={!originalFile || loading}
                className="cm-btn cm-btn-primary flex-1 px-4 py-2 rounded-md font-semibold disabled:opacity-60"
              >
                {loading ? "Compressing…" : "Compress"}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!(compressedFile || originalFile)}
                className="cm-btn cm-btn-ghost px-4 py-2 rounded-md"
              >
                Download
              </button>

              <button
                type="button"
                onClick={handleUseInRemover}
                disabled={!(compressedDataUrl || originalDataUrl)}
                className="cm-btn cm-btn-ghost px-4 py-2 rounded-md"
              >
                Use in Remover
              </button>
            </div>

            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

            {/* progress bar */}
            <div className="mt-3" aria-hidden={progress === 0}>
              <div className="h-2 rounded-full bg-[rgba(0,0,0,0.06)] overflow-hidden">
                <div
                  className="cm-progress-bar"
                  style={{
                    width: `${progress}%`,
                    transition: "width 220ms linear",
                    background:
                      "linear-gradient(90deg, var(--accent), rgba(var(--brand-yellow-rgb),0.8))",
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

        {/* RIGHT: previews (two columns) */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Original", src: originalDataUrl, file: originalFile },
            {
              label: "Compressed",
              src: compressedDataUrl,
              file: compressedFile,
            },
          ].map(({ label, src, file }, idx) => (
            <div
              key={idx}
              className="cm-preview-card rounded-2xl p-4"
              role="group"
              aria-label={`${label} preview card`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-[var(--muted)]">{label}</p>
                  {file ? (
                    <p className="text-sm font-semibold text-[var(--text)] mt-1">
                      {file.name}
                    </p>
                  ) : (
                    <p className="text-sm text-[var(--muted)] mt-1">No image</p>
                  )}
                </div>

                <div>
                  {file && (
                    <div
                      className="cm-badge"
                      role="status"
                      aria-label="file size"
                    >
                      {label === "Compressed" && compressionRatio != null
                        ? `${compressionRatio}% smaller`
                        : formatBytes(file.size)}
                    </div>
                  )}
                </div>
              </div>

              {/* image area */}
              <div className="mt-3 h-64 rounded-md overflow-hidden cm-image-area flex items-center justify-center">
                {src ? (
                  <img
                    src={src}
                    alt={`${label} preview`}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-sm text-[var(--muted)]">
                    No image selected
                  </div>
                )}
              </div>

              {/* utilities row */}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-[var(--muted)]">
                  {file ? `${formatBytes(file.size)} • ${file.type}` : ""}
                </div>

                <div className="flex items-center gap-2">
                  {src && (
                    <button
                      type="button"
                      onClick={() => {
                        const w = window.open("", "_blank");
                        if (w) {
                          w.document.write(
                            `<img src="${src}" style="max-width:100%"/>`
                          );
                          w.document.close();
                        }
                      }}
                      className="cm-btn cm-btn-ghost text-xs px-2 py-1 rounded-md"
                    >
                      Preview
                    </button>
                  )}

                  {label === "Compressed" && compressedFile && (
                    <button
                      onClick={handleDownload}
                      className="cm-btn cm-btn-ghost text-xs px-2 py-1 rounded-md"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
