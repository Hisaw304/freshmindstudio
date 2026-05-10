import React, { useEffect, useRef, useState } from "react";
import { compressFile } from "../../hooks/useImageCompressor";
import { fileToDataUrl } from "../../utils/toBase64";
import { Upload } from "lucide-react";
function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

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
    setProgress(4);

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
    a.download = `focusstudio-compressed.${ext}`;
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
      sessionStorage.setItem("focusstudio:selectedImage", durl);
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
    <section className="fm-st-compressor">
      <div aria-live="polite" ref={liveRegionRef} className="sr-only" />

      {/* HEADER */}
      <div className="fm-st-compressor-header">
        <h1>
          Image <span className="fm-st-highlight">Compressor</span>
        </h1>

        <p>
          Compress and optimize images directly in your browser while
          maintaining quality. Resize dimensions, reduce file size, and download
          optimized assets instantly.
        </p>
      </div>
      <div className="fm-st-compressor-layout">
        {/* MAIN CARD */}
        <div
          className={`fm-st-compressor-card ${
            dragActive ? "fm-st-compressor-card-active" : ""
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* UPLOAD AREA */}
          <div
            className={`fm-st-dropzone ${
              dragActive ? "fm-st-dropzone-active" : ""
            }`}
            tabIndex={0}
            role="button"
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                inputRef.current?.click();
              }
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {!originalDataUrl ? (
              <>
                <div className="fm-st-upload-icon">
                  <Upload />
                </div>

                <h3>Drop your image here</h3>

                <p>PNG • JPG • WEBP</p>

                <button
                  type="button"
                  className="fm-st-upload-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                >
                  Select Image
                </button>
              </>
            ) : (
              <div className="fm-st-preview-wrap">
                <img src={compressedDataUrl || originalDataUrl} alt="Preview" />

                <div className="fm-st-image-meta">
                  <div>
                    <span>Original</span>
                    <strong>{formatBytes(originalFile?.size || 0)}</strong>
                  </div>

                  {compressedFile && (
                    <div>
                      <span>Compressed</span>
                      <strong>{formatBytes(compressedFile?.size || 0)}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="fm-st-compressor-controls">
            {/* PRESET */}
            <div className="fm-st-control-group">
              <label>Compression Preset</label>

              <select
                value={preset}
                onChange={(e) => {
                  setPreset(e.target.value);
                  setMaxWidthOrHeight(presets[e.target.value].mw);
                }}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* DIMENSIONS */}
            <div className="fm-st-control-group">
              <label>Max Dimension</label>

              <input
                type="number"
                min="200"
                step="100"
                value={maxWidthOrHeight}
                onChange={(e) =>
                  setMaxWidthOrHeight(
                    Number(e.target.value || presets.medium.mw)
                  )
                }
              />
            </div>

            {/* PROGRESS */}
            {progress > 0 && (
              <div className="fm-st-progress">
                <div
                  className="fm-st-progress-bar"
                  style={{ width: `${progress}%` }}
                />

                <span>{Math.round(progress)}%</span>
              </div>
            )}

            {/* ACTIONS */}
            <div className="fm-st-compressor-actions">
              <button
                type="button"
                onClick={handleCompress}
                disabled={!originalFile || loading}
                className="fm-st-primary-btn"
              >
                {loading ? "Compressing..." : "Compress Image"}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!compressedFile}
                className="fm-st-secondary-btn"
              >
                Download
              </button>
            </div>

            {/* ERROR */}
            {error && <div className="fm-st-error">{error}</div>}
          </div>
        </div>
        {/* RIGHT - HOW IT WORKS */}
        <div className="fm-st-how-card">
          <div className="fm-st-how-badge">Simple Process</div>

          <h3>How it works</h3>

          <div className="fm-st-how-steps">
            <div className="fm-st-how-step">
              <div className="fm-st-step-number">01</div>

              <div>
                <h4>Upload your image</h4>

                <p>Drag and drop or select any PNG, JPG, or WEBP image.</p>
              </div>
            </div>

            <div className="fm-st-how-step">
              <div className="fm-st-step-number">02</div>

              <div>
                <h4>Choose optimization</h4>

                <p>
                  Adjust compression quality and image dimensions instantly.
                </p>
              </div>
            </div>

            <div className="fm-st-how-step">
              <div className="fm-st-step-number">03</div>

              <div>
                <h4>Download optimized file</h4>

                <p>
                  Get a smaller, faster-loading image without losing quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
