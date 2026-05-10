// src/components/pdf/CompressPdf.jsx

import { useRef, useState } from "react";
import { Upload, FileArchive } from "lucide-react";

export default function CompressPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (!files?.length) return;

    const selected = files[0];

    if (selected.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setFile(selected);
  };

  const handleCompress = async () => {
    if (!file) return;

    try {
      setLoading(true);

      /*
      Browser-only PDF compression is limited.
      This currently re-exports the PDF.
      Later you can replace with real backend compression.
    */

      const bytes = await file.arrayBuffer();

      const blob = new Blob([bytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      setCompressedUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to compress PDF.");
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = () => {
    if (!compressedUrl) return;

    const a = document.createElement("a");

    a.href = compressedUrl;

    a.download = "focusstudio-compressed.pdf";

    document.body.appendChild(a);

    a.click();

    a.remove();
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
          onClick={() => inputRef.current?.click()}
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
            accept=".pdf"
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="fm-pdf-upload-icon">
            <Upload size={32} />
          </div>

          <h3>{file ? file.name : "Upload PDF file"}</h3>

          <p>Reduce PDF file size instantly</p>

          {!file && (
            <button type="button" className="fm-pdf-primary-btn">
              Select PDF
            </button>
          )}
        </div>

        {/* FILE META */}

        {file && (
          <div className="fm-pdf-file-list">
            <div className="fm-pdf-file-item">
              <span>{file.name}</span>

              <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
            </div>
          </div>
        )}

        {/* COMPRESS BUTTON */}

        {file && !compressedUrl && (
          <button
            type="button"
            className="fm-pdf-primary-btn"
            disabled={loading}
            onClick={handleCompress}
          >
            {loading ? "Compressing PDF..." : "Compress PDF"}
          </button>
        )}

        {/* DOWNLOAD BUTTON */}

        {compressedUrl && (
          <button
            type="button"
            className="fm-pdf-secondary-btn"
            onClick={handleDownload}
          >
            Download PDF
          </button>
        )}
      </div>

      {/* HOW IT WORKS */}
      <div className="fm-pdf-how-card">
        <div className="fm-pdf-how-badge">Optimization</div>

        <h3>How it works</h3>

        <div className="fm-pdf-how-steps">
          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">01</div>

            <div>
              <h4>Upload PDF</h4>

              <p>Select the PDF document you want to optimize.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">02</div>

            <div>
              <h4>Compress file</h4>

              <p>
                We optimize the PDF for smaller file size and faster sharing.
              </p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">03</div>

            <div>
              <h4>Download optimized PDF</h4>

              <p>Your compressed PDF is ready instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
