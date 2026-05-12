// src/components/ai-media/FaceRestoration.jsx

import { useRef, useState } from "react";
import { Upload, ScanFace } from "lucide-react";

export default function FaceRestoration() {
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const [restoredImage, setRestoredImage] = useState(null);

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

    setRestoredImage(null);

    const url = URL.createObjectURL(selected);

    setPreview(url);
  };

  /* RESTORE FACE */

  const handleRestore = async () => {
    if (!file) return;

    try {
      setLoading(true);

      /*
        REAL FACE RESTORATION:
        - gfpgan
        - codeformer
        - replicate
        - fal.ai
        - restoreformer

        CURRENT:
        demo preview flow
      */

      await new Promise((resolve) => setTimeout(resolve, 2200));

      setRestoredImage(preview);
    } catch (err) {
      console.error(err);

      alert("Failed restoring face.");
    } finally {
      setLoading(false);
    }
  };

  /* DOWNLOAD */

  const handleDownload = () => {
    if (!restoredImage) return;

    const a = document.createElement("a");

    a.href = restoredImage;

    a.download = "focusmedia-face-restored.png";

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
                AI Face <span>Restoration</span>
              </h3>

              <p>
                Restore blurry, old, low-quality, or damaged face photos using
                advanced AI enhancement.
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
                {!restoredImage && (
                  <button
                    type="button"
                    className="fm-ai-primary-btn"
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();

                      handleRestore();
                    }}
                  >
                    {loading ? "Restoring Face..." : "Restore Face"}
                  </button>
                )}

                {restoredImage && (
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
          <ScanFace size={15} />
          AI Restoration
        </div>

        <h3>
          Restore portraits and faces with <span>AI</span>
        </h3>

        <div className="fm-ai-how-steps">
          <div className="fm-ai-how-step">
            <div className="fm-ai-step-number">01</div>

            <div>
              <h4>Upload image</h4>

              <p>Select an old, blurry, or low-quality portrait image.</p>
            </div>
          </div>

          <div className="fm-ai-how-step">
            <div className="fm-ai-step-number">02</div>

            <div>
              <h4>AI restoration</h4>

              <p>
                AI restores facial details, sharpness, texture, and overall
                image quality.
              </p>
            </div>
          </div>

          <div className="fm-ai-how-step">
            <div className="fm-ai-step-number">03</div>

            <div>
              <h4>Download result</h4>

              <p>Your restored portrait is ready instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
