// src/components/pdf/PdfSigner.jsx

import { useRef, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { Upload } from "lucide-react";

export default function PdfSigner() {
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [signedUrl, setSignedUrl] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (!files?.length) return;

    const selected = files[0];

    if (selected.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setFile(selected);

    setSignedUrl(null);
  };

  const handleSign = async () => {
    if (!file || !signature.trim()) return;

    try {
      setLoading(true);

      const bytes = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(bytes);

      const pages = pdfDoc.getPages();

      const firstPage = pages[0];

      const { width } = firstPage.getSize();

      firstPage.drawText(signature, {
        x: width - 220,
        y: 40,
        size: 20,
        color: rgb(0.1, 0.1, 0.1),
      });

      const signedPdf = await pdfDoc.save();

      const blob = new Blob([signedPdf], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      setSignedUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to sign PDF.");
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = () => {
    if (!signedUrl) return;

    const a = document.createElement("a");

    a.href = signedUrl;

    a.download = "focusstudio-signed.pdf";

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

          <p>Drag & drop or select a PDF file</p>

          {!file && (
            <button
              type="button"
              className="fm-pdf-primary-btn"
              onClick={() => inputRef.current?.click()}
            >
              Select PDF
            </button>
          )}
        </div>

        {/* FILE INFO */}

        {file && (
          <div className="fm-pdf-file-list">
            <div className="fm-pdf-file-item">
              <span>{file.name}</span>

              <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
            </div>
          </div>
        )}

        {/* SIGNATURE FIELD */}

        {file && (
          <div className="fm-pdf-field">
            <label>Your Signature</label>

            <input
              type="text"
              placeholder="Type your signature"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
            />
          </div>
        )}

        {/* SIGN BUTTON */}

        {file && !signedUrl && (
          <button
            type="button"
            className="fm-pdf-primary-btn"
            disabled={!signature || loading}
            onClick={handleSign}
          >
            {loading ? "Signing PDF..." : "Sign PDF"}
          </button>
        )}

        {/* DOWNLOAD BUTTON */}

        {signedUrl && (
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
        <div className="fm-pdf-how-badge">Digital Signing</div>

        <h3>How it works</h3>

        <div className="fm-pdf-how-steps">
          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">01</div>

            <div>
              <h4>Upload PDF</h4>

              <p>Select the PDF document you want to sign.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">02</div>

            <div>
              <h4>Add signature</h4>

              <p>Type your signature or name into the signing field.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">03</div>

            <div>
              <h4>Download signed PDF</h4>

              <p>
                Your signed PDF is generated instantly and ready to download.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
