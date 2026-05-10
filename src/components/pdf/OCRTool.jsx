import { useRef, useState } from "react";
import Tesseract from "tesseract.js";
import { Upload } from "lucide-react";

export default function OCRTool() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const inputRef = useRef(null);

  /* HANDLE FILES */

  const handleFiles = (files) => {
    if (!files?.length) return;

    const selected = files[0];

    if (
      !selected.type.startsWith("image/") &&
      selected.type !== "application/pdf"
    ) {
      alert("Please upload an image or PDF.");
      return;
    }

    setFile(selected);

    setExtractedText("");

    setProgress(0);

    if (selected.type.startsWith("image/")) {
      const url = URL.createObjectURL(selected);

      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  /* OCR */

  const handleExtract = async () => {
    if (!file) return;

    try {
      setLoading(true);

      setProgress(0);

      setExtractedText("");

      if (!file.type.startsWith("image/")) {
        alert("Current OCR supports images only.");

        return;
      }

      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      setExtractedText(result.data.text || "");
    } catch (err) {
      console.error(err);

      alert("Failed extracting text.");
    } finally {
      setLoading(false);
    }
  };

  /* COPY */

  const handleCopy = async () => {
    if (!extractedText) return;

    try {
      await navigator.clipboard.writeText(extractedText);

      alert("Text copied.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fm-pdf-layout">
      {/* MAIN CARD */}

      <div className="fm-pdf-tool-card">
        {/* DROPZONE */}

        <div
          className={`fm-pdf-dropzone ${
            dragActive ? "fm-pdf-dropzone-active" : ""
          }`}
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
          onClick={() => !file && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,.pdf"
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {!file ? (
            <>
              <div className="fm-pdf-upload-icon">
                <Upload size={32} />
              </div>

              <h3>Upload image or PDF</h3>

              <p>JPG, PNG, WEBP, or PDF supported</p>

              <button
                type="button"
                className="fm-pdf-primary-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
              >
                Select File
              </button>
            </>
          ) : (
            <>
              {/* IMAGE PREVIEW INSIDE DROPZONE */}

              {preview ? (
                <div className="fm-pdf-ocr-preview">
                  <img src={preview} alt="Preview" />
                </div>
              ) : (
                <div className="fm-pdf-file-list">
                  <div className="fm-pdf-file-item">
                    <span>{file.name}</span>

                    <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                  </div>
                </div>
              )}

              {/* OCR BUTTON */}

              {!extractedText && (
                <button
                  type="button"
                  className="fm-pdf-primary-btn"
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExtract();
                  }}
                >
                  {loading ? "Extracting Text..." : "Extract Text"}
                </button>
              )}
            </>
          )}
        </div>

        {/* PDF NOTICE */}

        {file?.type === "application/pdf" && (
          <div className="fm-pdf-info">
            PDF OCR currently supports image OCR only.
          </div>
        )}

        {/* PROGRESS */}

        {loading && (
          <div className="fm-pdf-progress">
            <div
              className="fm-pdf-progress-bar"
              style={{ width: `${progress}%` }}
            />

            <span>{progress}%</span>
          </div>
        )}

        {/* RESULT */}

        {extractedText && (
          <div className="fm-pdf-ocr-result">
            <div className="fm-pdf-result-top">
              <h4>Extracted Text</h4>

              <button
                type="button"
                className="fm-pdf-secondary-btn"
                onClick={handleCopy}
              >
                Copy Text
              </button>
            </div>

            <textarea
              className="fm-pdf-ocr-textarea"
              value={extractedText}
              readOnly
            />
          </div>
        )}
      </div>

      {/* HOW IT WORKS */}

      <div className="fm-pdf-how-card">
        <div className="fm-pdf-how-badge">OCR Workflow</div>

        <h3>How it works</h3>

        <div className="fm-pdf-how-steps">
          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">01</div>

            <div>
              <h4>Upload image</h4>

              <p>Select an image containing readable text.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">02</div>

            <div>
              <h4>OCR scanning</h4>

              <p>AI recognition extracts text automatically.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">03</div>

            <div>
              <h4>Copy extracted text</h4>

              <p>Reuse the extracted text instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
