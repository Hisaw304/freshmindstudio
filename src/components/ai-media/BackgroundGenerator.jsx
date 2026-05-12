// src/components/ai-media/BackgroundGenerator.jsx

import { useRef, useState } from "react";
import { Upload, ImagePlus } from "lucide-react";

export default function BackgroundGenerator() {
  const [file, setFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [prompt, setPrompt] = useState("");

  const [loading, setLoading] = useState(false);

  const [dragActive, setDragActive] = useState(false);

  const [generatedImage, setGeneratedImage] = useState(null);

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

    setGeneratedImage(null);

    const url = URL.createObjectURL(selected);

    setPreview(url);
  };

  /* GENERATE BACKGROUND */

  const handleGenerate = async () => {
    if (!file || !prompt.trim()) return;

    try {
      setLoading(true);

      /*
        REAL AI BACKGROUND GENERATION:
        - stability ai
        - replicate
        - clipdrop replace background
        - segmentation + generative fill
        - fal.ai

        CURRENT:
        demo preview flow
      */

      await new Promise((resolve) => setTimeout(resolve, 2200));

      setGeneratedImage(preview);
    } catch (err) {
      console.error(err);

      alert("Failed generating background.");
    } finally {
      setLoading(false);
    }
  };

  /* DOWNLOAD */

  const handleDownload = () => {
    if (!generatedImage) return;

    const a = document.createElement("a");

    a.href = generatedImage;

    a.download = "focusmedia-background-generated.png";

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
                AI Background <span>Generator</span>
              </h3>

              <p>
                Replace dull backgrounds with AI-generated scenes, environments,
                and creative visuals.
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

              {!generatedImage && (
                <div className="fm-ai-field">
                  <label>Background Prompt</label>

                  <input
                    type="text"
                    placeholder="Example: Luxury office, beach sunset, cyberpunk city..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
              )}

              {/* ACTIONS */}

              <div className="fm-ai-actions">
                {!generatedImage && (
                  <button
                    type="button"
                    className="fm-ai-primary-btn"
                    disabled={loading || !prompt.trim()}
                    onClick={(e) => {
                      e.stopPropagation();

                      handleGenerate();
                    }}
                  >
                    {loading
                      ? "Generating Background..."
                      : "Generate Background"}
                  </button>
                )}

                {generatedImage && (
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
          <ImagePlus size={15} />
          AI Generation
        </div>

        <h3>
          Create new backgrounds with <span>AI</span>
        </h3>

        <div className="fm-ai-how-steps">
          <div className="fm-ai-how-step">
            <div className="fm-ai-step-number">01</div>

            <div>
              <h4>Upload image</h4>

              <p>Select an image you want to enhance with a new background.</p>
            </div>
          </div>

          <div className="fm-ai-how-step">
            <div className="fm-ai-step-number">02</div>

            <div>
              <h4>Describe background</h4>

              <p>
                Enter a creative AI prompt describing the desired environment.
              </p>
            </div>
          </div>

          <div className="fm-ai-how-step">
            <div className="fm-ai-step-number">03</div>

            <div>
              <h4>Download result</h4>

              <p>Your AI-generated image is ready instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
