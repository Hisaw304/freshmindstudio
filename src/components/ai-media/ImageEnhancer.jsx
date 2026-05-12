// src/components/ai-media/ImageEnhancer.jsx

import { useRef, useState } from "react";
import { Upload, Sparkles } from "lucide-react";

export default function ImageEnhancer() {
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const [enhancedImage, setEnhancedImage] = useState(null);

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

    setEnhancedImage(null);

    const url = URL.createObjectURL(selected);

    setPreview(url);
  };

  /* ENHANCE IMAGE */

  const handleEnhance = async () => {
    if (!file) return;

    try {
      setLoading(true);

      /*
        REAL AI ENHANCEMENT:
        - realesrgan
        - replicate
        - clipdrop enhance
        - stability ai
        - fal.ai

        CURRENT:
        demo preview flow
      */

      await new Promise((resolve) => setTimeout(resolve, 2200));

      setEnhancedImage(preview);
    } catch (err) {
      console.error(err);

      alert("Failed enhancing image.");
    } finally {
      setLoading(false);
    }
  };

  /* DOWNLOAD */

  const handleDownload = () => {
    if (!enhancedImage) return;

    const a = document.createElement("a");

    a.href = enhancedImage;

    a.download = "focusmedia-enhanced.png";

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
                AI Image <span>Enhancer</span>
              </h3>

              <p>
                Improve image clarity, sharpness, lighting, and overall visual
                quality instantly.
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
                {!enhancedImage && (
                  <button
                    type="button"
                    className="fm-ai-primary-btn"
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();

                      handleEnhance();
                    }}
                  >
                    {loading ? "Enhancing Image..." : "Enhance Image"}
                  </button>
                )}

                {enhancedImage && (
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
          Improve photo quality using <span>AI</span>
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
              <h4>AI enhancement</h4>

              <p>
                AI improves image sharpness, colors, contrast, and overall
                visual quality.
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
