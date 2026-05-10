import { useRef, useState } from "react";

export default function WordToPdf() {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files) => {
    if (!files?.length) return;

    const selected = files[0];

    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!validTypes.includes(selected.type)) {
      return alert("Please upload a Word document.");
    }

    setFile(selected);
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
            accept=".doc,.docx"
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />

          {!file ? (
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

              <h3>Drop your Word file here</h3>

              <p>
                Upload DOC or DOCX documents and instantly convert them into
                high-quality PDF files.
              </p>

              <button type="button" className="fm-pdf-primary-btn">
                Select Word File
              </button>
            </>
          ) : (
            <div className="fm-pdf-file">
              <h4>{file.name}</h4>

              <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>

              <button type="button" className="fm-pdf-primary-btn">
                Convert to PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="fm-pdf-how-card">
        <div className="fm-pdf-how-badge">Document Workflow</div>

        <h3>How it works</h3>

        <div className="fm-pdf-how-steps">
          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">01</div>

            <div>
              <h4>Upload Word file</h4>

              <p>Drag and drop or select any DOC or DOCX document.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">02</div>

            <div>
              <h4>Convert to PDF</h4>

              <p>
                Your document is processed and transformed into a clean PDF.
              </p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">03</div>

            <div>
              <h4>Download instantly</h4>

              <p>Save your new PDF file and use it anywhere you need.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
