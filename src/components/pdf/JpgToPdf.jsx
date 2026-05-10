// src/components/pdf/JpgToPdf.jsx

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Image as ImageIcon } from "lucide-react";

export default function JpgToPdf() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const inputRef = useRef(null);

  const handleFiles = (selectedFiles) => {
    if (!selectedFiles?.length) return;

    const validFiles = Array.from(selectedFiles).filter((file) =>
      file.type.startsWith("image/")
    );

    if (!validFiles.length) {
      alert("Please upload JPG or PNG images.");
      return;
    }

    setFiles(validFiles);
  };

  const handleConvert = async () => {
    if (!files.length) return;

    try {
      setLoading(true);

      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();

        let image;

        if (file.type === "image/jpg" || file.type === "image/jpeg") {
          image = await pdfDoc.embedJpg(bytes);
        } else {
          image = await pdfDoc.embedPng(bytes);
        }

        const page = pdfDoc.addPage([image.width, image.height]);

        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to create PDF.");
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = () => {
    if (!pdfUrl) return;

    const a = document.createElement("a");

    a.href = pdfUrl;

    a.download = "focusstudio-images.pdf";

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
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="fm-pdf-upload-icon">
            <Upload size={32} />
          </div>

          <h3>
            {files.length
              ? `${files.length} image(s) selected`
              : "Upload images"}
          </h3>

          <p>JPG, JPEG, and PNG supported</p>

          <button type="button" className="fm-pdf-primary-btn">
            Select Images
          </button>
        </div>

        {/* FILE LIST */}
        {files.length > 0 && (
          <div className="fm-pdf-file-list">
            {files.map((file, index) => (
              <div key={index} className="fm-pdf-file-item">
                {file.name}
              </div>
            ))}
          </div>
        )}

        {/* ACTIONS */}

        {files.length > 0 && !pdfUrl && (
          <button
            type="button"
            className="fm-pdf-primary-btn"
            disabled={loading}
            onClick={handleConvert}
          >
            {loading ? "Creating PDF..." : "Convert to PDF"}
          </button>
        )}

        {pdfUrl && (
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
        <div className="fm-pdf-how-badge">Image Conversion</div>

        <h3>How it works</h3>

        <div className="fm-pdf-how-steps">
          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">01</div>

            <div>
              <h4>Upload images</h4>

              <p>Select JPG or PNG files from your device.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">02</div>

            <div>
              <h4>Create PDF</h4>

              <p>Images are converted and combined into a PDF document.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">03</div>

            <div>
              <h4>Download file</h4>

              <p>Your new PDF is ready instantly for download.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
