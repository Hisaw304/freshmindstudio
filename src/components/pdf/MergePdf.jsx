import { useRef, useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function MergePdf() {
  const inputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const [loading, setLoading] = useState(false);

  const [mergedUrl, setMergedUrl] = useState(null);

  /* HANDLE FILES */

  const handleFiles = (selectedFiles) => {
    if (!selectedFiles?.length) return;

    const pdfs = Array.from(selectedFiles).filter(
      (file) => file.type === "application/pdf"
    );

    setFiles(pdfs);
    setMergedUrl(null);
  };

  /* MERGE PDFS */

  const handleMerge = async () => {
    if (files.length < 2) return;

    try {
      setLoading(true);

      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();

        const pdf = await PDFDocument.load(bytes);

        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedBytes = await mergedPdf.save();

      const blob = new Blob([mergedBytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      setMergedUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* DOWNLOAD */

  const handleDownload = () => {
    if (!mergedUrl) return;

    const a = document.createElement("a");

    a.href = mergedUrl;

    a.download = "focusstudio-merged.pdf";

    document.body.appendChild(a);

    a.click();

    a.remove();
  };

  return (
    <div className="fm-pdf-layout">
      {/* MAIN TOOL CARD */}
      <div
        className={`fm-pdf-card ${dragActive ? "fm-pdf-card-active" : ""}`}
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
        {/* DROPZONE */}
        <div
          className={`fm-pdf-dropzone ${
            dragActive ? "fm-pdf-dropzone-active" : ""
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            multiple
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {!files.length ? (
            <>
              <div className="fm-pdf-upload-icon">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 16V4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />

                  <path
                    d="M7 9L12 4L17 9"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />

                  <path
                    d="M5 20H19"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3>Drop PDF files here</h3>

              <p>
                Upload multiple PDF files and combine them into a single
                document instantly.
              </p>

              <button type="button" className="fm-pdf-primary-btn">
                Select PDFs
              </button>
            </>
          ) : (
            <div className="fm-pdf-file">
              <h4>
                {files.length} PDF
                {files.length > 1 ? "s" : ""} selected
              </h4>

              <div className="fm-pdf-file-list">
                {files.map((file, index) => (
                  <div key={index} className="fm-pdf-file-item">
                    <span>{file.name}</span>

                    <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}

              <button
                type="button"
                className="fm-pdf-primary-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMerge();
                }}
                disabled={loading || files.length < 2}
              >
                {loading ? "Merging..." : "Merge PDFs"}
              </button>

              {mergedUrl && (
                <button
                  type="button"
                  className="fm-pdf-secondary-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  Download PDF
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="fm-pdf-how-card">
        <div className="fm-pdf-how-badge">PDF Workflow</div>

        <h3>How it works</h3>

        <div className="fm-pdf-how-steps">
          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">01</div>

            <div>
              <h4>Select PDF files</h4>

              <p>Upload multiple PDF documents you want to combine.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">02</div>

            <div>
              <h4>Merge documents</h4>

              <p>The files are combined together into a single PDF.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">03</div>

            <div>
              <h4>Download merged PDF</h4>

              <p>Save your merged document instantly to your device.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
