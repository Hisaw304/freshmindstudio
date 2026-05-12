// src/components/ai-media/AiUpscaler.jsx

import { useRef, useState } from "react";
import { Upload, Sparkles } from "lucide-react";

export default function AiUpscaler() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const [upscaledImage, setUpscaledImage] = useState(null);

  const inputRef = useRef(null);

  /* HANDLE FILES */

  const handleFiles = (files) => {
    if (!files?.length) return;

    const selected = files[0];

    if (!selected.type.startsWith("image/")) {
      alert("Please upload an image.");
      return;
    }

    setFile(selected);

    setUpscaledImage(null);

    const url = URL.createObjectURL(selected);

    setPreview(url);
  };

  /* UPSCALE */

  const handleUpscale = async () => {
    if (!file) return;

    try {
      setLoading(true);

      /*
        REAL AI UPSCALING:
        - replicate
        - clipdrop
        - stability ai
        - fal.ai
        - server inference

        CURRENT:
        demo preview flow
      */

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUpscaledImage(preview);
    } catch (err) {
      console.error(err);

      alert("Failed to upscale image.");
    } finally {
      setLoading(false);
    }
  };

  /* DOWNLOAD */

  const handleDownload = () => {
    if (!upscaledImage) return;

    const a = document.createElement("a");

    a.href = upscaledImage;

    a.download = "focusmedia-upscaled.png";

    document.body.appendChild(a);

    a.click();

    a.remove();
  };

  return (
    <div className="fm-ai-layout">
      {/* MAIN CARD */}

      <div className="fm-ai-card">
        {/* DROPZONE */}

        <div
          className={`fm-ai-dropzone ${
            dragActive ? "fm-ai-dropzone-active" : ""
          }`}
          onClick={() => !file && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();

            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();

            setDragActive(false);
          }}
          onDrop={(e) => {
            e.preventDefault();

            setDragActive(false);

            handleFiles(e.dataTransfer.files);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {!file ? (
            <>
              <div className="fm-ai-upload-icon">
                <Upload size={34} />
              </div>

              <h3>
                AI Image <span>Upscaler</span>
              </h3>

              <p>
                Increase image resolution and improve image quality instantly
                using AI enhancement.
              </p>

              <button
                type="button"
                className="fm-ai-primary-btn"
                onClick={() => inputRef.current?.click()}
              >
                Select Image
              </button>
            </>
          ) : (
            <>
              {/* PREVIEW */}

              <div className="fm-ai-preview">
                <img src={preview} alt="Preview" />
              </div>

              {/* FILE INFO */}

              <div className="fm-ai-file">
                <h4>{file.name}</h4>

                <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>

              {/* ACTIONS */}

              <div className="fm-ai-actions">
                {!upscaledImage && (
                  <button
                    type="button"
                    className="fm-ai-primary-btn"
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();

                      handleUpscale();
                    }}
                  >
                    {loading ? "Upscaling..." : "Upscale Image"}
                  </button>
                )}

                {upscaledImage && (
                  <button
                    type="button"
                    className="fm-ai-secondary-btn"
                    onClick={(e) => {
                      e.stopPropagation();

                      handleDownload();
                    }}
                  >
                    Download Image
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* HOW CARD */}

      <div className="fm-ai-how-card">
        <div className="fm-ai-how-badge">
          <Sparkles size={15} />
          AI Enhancement
        </div>

        <h3>
          Improve image quality with <span>AI</span>
        </h3>

        <div className="fm-ai-how-steps">
          <div className="fm-ai-how-step">
            <div className="fm-ai-step-number">01</div>

            <div>
              <h4>Upload image</h4>

              <p>Select a JPG, PNG, or WEBP image from your device.</p>
            </div>
          </div>

          <div className="fm-ai-how-step">
            <div className="fm-ai-step-number">02</div>

            <div>
              <h4>AI upscale</h4>

              <p>
                AI improves sharpness, clarity, and image resolution
                automatically.
              </p>
            </div>
          </div>

          <div className="fm-ai-how-step">
            <div className="fm-ai-step-number">03</div>

            <div>
              <h4>Download image</h4>

              <p>Your enhanced image is ready instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
