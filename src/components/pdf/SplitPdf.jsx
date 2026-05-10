// src/components/pdf/SplitPdf.jsx

import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Scissors } from "lucide-react";

export default function SplitPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState("");
  const [splitUrl, setSplitUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);

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

  const parsePages = (value) => {
    return value
      .split(",")
      .map((p) => parseInt(p.trim(), 10))
      .filter((p) => !isNaN(p));
  };

  const handleSplit = async () => {
    if (!file || !pages) return;

    try {
      setLoading(true);

      const bytes = await file.arrayBuffer();

      const pdf = await PDFDocument.load(bytes);

      const outputPdf = await PDFDocument.create();

      const selectedPages = parsePages(pages);

      for (const pageNumber of selectedPages) {
        if (pageNumber < 1 || pageNumber > pdf.getPageCount()) continue;

        const [copiedPage] = await outputPdf.copyPages(pdf, [pageNumber - 1]);

        outputPdf.addPage(copiedPage);
      }

      const finalPdf = await outputPdf.save();

      const blob = new Blob([finalPdf], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      setSplitUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to split PDF.");
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = () => {
    if (!splitUrl) return;

    const a = document.createElement("a");

    a.href = splitUrl;

    a.download = "focusstudio-split.pdf";

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

          <p>Select a PDF to split pages</p>

          <button type="button" className="fm-pdf-primary-btn">
            Select PDF
          </button>
        </div>

        {/* PAGE INPUT */}
        <div className="fm-pdf-field">
          <label>Pages to extract</label>

          <input
            type="text"
            placeholder="Example: 1,2,5"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          />

          <small>Separate page numbers with commas.</small>
        </div>

        {/* ACTIONS */}
        <div className="fm-pdf-actions">
          <button
            type="button"
            className="fm-pdf-primary-btn"
            disabled={!file || !pages || loading}
            onClick={handleSplit}
          >
            {loading ? "Splitting PDF..." : "Split PDF"}
          </button>

          <button
            type="button"
            className="fm-pdf-secondary-btn"
            disabled={!splitUrl}
            onClick={handleDownload}
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="fm-pdf-how-card">
        <div className="fm-pdf-how-badge">Quick Workflow</div>

        <h3>How it works</h3>

        <div className="fm-pdf-how-steps">
          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">01</div>

            <div>
              <h4>Upload PDF</h4>

              <p>Select the PDF document you want to split.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">02</div>

            <div>
              <h4>Select pages</h4>

              <p>Enter the page numbers you want to extract.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">03</div>

            <div>
              <h4>Download PDF</h4>

              <p>Your new split PDF is generated instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
