// src/components/ai-media/ObjectRemover.jsx

import { useRef, useState } from "react";
import { Upload, Wand2 } from "lucide-react";

export default function ObjectRemover() {
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const [editedImage, setEditedImage] = useState(null);

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

    setEditedImage(null);

    const url = URL.createObjectURL(selected);

    setPreview(url);
  };

  /* REMOVE OBJECT */

  const handleRemoveObject = async () => {
    if (!file) return;

    try {
      setLoading(true);

      /*
        REAL AI OBJECT REMOVAL:
        - clipdrop cleanup
        - replicate inpainting
        - stability ai
        - fal.ai
        - segmentation masking

        CURRENT:
        demo preview flow
      */

      await new Promise((resolve) => setTimeout(resolve, 2200));

      setEditedImage(preview);
    } catch (err) {
      console.error(err);

      alert("Failed to remove object.");
    } finally {
      setLoading(false);
    }
  };

  /* DOWNLOAD */

  const handleDownload = () => {
    if (!editedImage) return;

    const a = document.createElement("a");

    a.href = editedImage;

    a.download = "focusmedia-object-removed.png";

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
                AI Object <span>Remover</span>
              </h3>

              <p>
                Remove unwanted people, objects, text, or distractions from your
                images instantly.
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
                {!editedImage && (
                  <button
                    type="button"
                    className="fm-ai-primary-btn"
                    disabled={loading}
                    onClick={(e) => {
                      e.stopPropagation();

                      handleRemoveObject();
                    }}
                  >
                    {loading ? "Removing Object..." : "Remove Object"}
                  </button>
                )}

                {editedImage && (
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
          <Wand2 size={15} />
          AI Cleanup
        </div>

        <h3>
          Remove unwanted objects with <span>AI</span>
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
              <h4>AI object removal</h4>

              <p>
                AI detects and removes distractions while preserving the image
                naturally.
              </p>
            </div>
          </div>

          <div className="fm-ai-how-step">
            <div className="fm-ai-step-number">03</div>

            <div>
              <h4>Download result</h4>

              <p>Your cleaned image is ready instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
