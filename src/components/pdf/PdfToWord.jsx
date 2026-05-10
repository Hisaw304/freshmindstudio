import { useRef, useState } from "react";

export default function PdfToWord() {
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files) => {
    if (!files?.length) return;

    const selected = files[0];

    if (selected.type !== "application/pdf") {
      return alert("Please upload a PDF file.");
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
            accept=".pdf"
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

              <h3>Drop your PDF here</h3>

              <p>
                Upload a PDF file and convert it into an editable Word document
                instantly.
              </p>

              <button type="button" className="fm-pdf-primary-btn">
                Select PDF
              </button>
            </>
          ) : (
            <div className="fm-pdf-file">
              <h4>{file.name}</h4>

              <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>

              <button type="button" className="fm-pdf-primary-btn">
                Convert to Word
              </button>
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
              <h4>Upload PDF</h4>

              <p>Drag and drop or select your PDF file.</p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">02</div>

            <div>
              <h4>Convert document</h4>

              <p>
                The PDF is processed and transformed into an editable Word file.
              </p>
            </div>
          </div>

          <div className="fm-pdf-how-step">
            <div className="fm-pdf-step-number">03</div>

            <div>
              <h4>Download DOCX</h4>

              <p>Download your converted Word document instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
