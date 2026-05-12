// src/components/ai-media/AiRecolor.jsx

import { useRef, useState } from "react";
import { Upload, Palette } from "lucide-react";

export default function AiRecolor() {
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const [recoloredImage, setRecoloredImage] = useState(null);

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

    setRecoloredImage(null);

    const url = URL.createObjectURL(selected);

    setPreview(url);
  };

  /* RECOLOR */

  const handleRecolor = async () => {
    if (!file || !prompt.trim()) return;

    try {
      setLoading(true);

      /*
        REAL AI RECOLOR:
        - segmentation models
        - generative fill
        - stability ai
        - replicate
        - clipdrop recolor
        - fal.ai

        CURRENT:
        demo preview flow
      */

      await new Promise((resolve) => setTimeout(resolve, 2200));

      setRecoloredImage(preview);
    } catch (err) {
      console.error(err);

      alert("Failed recoloring image.");
    } finally {
      setLoading(false);
    }
  };

  /* DOWNLOAD */

  const handleDownload = () => {
    if (!recoloredImage) return;

    const a = document.createElement("a");

    a.href = recoloredImage;

    a.download = "focusmedia-recolored.png";

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
                AI Image <span>Recolor</span>
              </h3>

              <p>
                Transform image colors, outfits, backgrounds, and objects using
                intelligent AI recoloring.
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

              {/* PROMPT */}

              {!recoloredImage && (
                <div className="fm-ai-field">
                  <label>Recolor Prompt</label>

                  <input
                    type="text"
                    placeholder="Example: Change shirt to black, make background neon blue..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
              )}

              {/* ACTIONS */}

              <div className="fm-ai-actions">
                {!recoloredImage && (
                  <button
                    type="button"
                    className="fm-ai-primary-btn"
                    disabled={loading || !prompt.trim()}
                    onClick={(e) => {
                      e.stopPropagation();

                      handleRecolor();
                    }}
                  >
                    {loading ? "Recoloring Image..." : "Recolor Image"}
                  </button>
                )}

                {recoloredImage && (
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
          <Palette size={15} />
          AI Recoloring
        </div>

        <h3>
          Change colors instantly with <span>AI</span>
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
              <h4>Describe recolor</h4>

              <p>
                Enter a prompt describing the colors or visual changes you want.
              </p>
            </div>
          </div>

          <div className="fm-ai-how-step">
            <div className="fm-ai-step-number">03</div>

            <div>
              <h4>Download image</h4>

              <p>Your AI recolored image is ready instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
