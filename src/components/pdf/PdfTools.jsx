import { useState } from "react";

import PdfToWord from "./PdfToWord";
import WordToPdf from "./WordToPdf";
import MergePdf from "./MergePdf";
import SplitPdf from "./SplitPdf";
import CompressPdf from "./CompressPdf";
import JpgToPdf from "./JpgToPdf";
import PdfSigner from "./PdfSigner";
import OCRTool from "./OCRTool";

export default function PdfTools() {
  const [activeTool, setActiveTool] = useState("pdf-to-word");

  return (
    <section className="fm-pdf">
      {/* HEADER */}
      <div className="fm-pdf-header">
        <h1>PDF Tools</h1>

        <p>
          Convert, compress, merge, split, and manage PDF files directly in your
          browser with fast modern tools.
        </p>
      </div>

      {/* TOOL SELECTOR */}
      <div className="fm-pdf-selector">
        <select
          value={activeTool}
          onChange={(e) => setActiveTool(e.target.value)}
        >
          <option value="pdf-to-word">PDF to Word</option>

          <option value="word-to-pdf">Word to PDF</option>
          <option value="merge-pdf">Merge PDF</option>
          <option value="split-pdf">Split PDF</option>
          <option value="compress-pdf">Compress PDF</option>
          <option value="jpg-pdf">JPG TO PDF</option>
          <option value="pdf-signer">PDF Signer</option>
          <option value="ocr-tool">OCR Tool</option>
        </select>
      </div>

      {/* ACTIVE TOOL */}
      {activeTool === "pdf-to-word" && <PdfToWord />}
      {activeTool === "word-to-pdf" && <WordToPdf />}
      {activeTool === "merge-pdf" && <MergePdf />}
      {activeTool === "split-pdf" && <SplitPdf />}
      {activeTool === "compress-pdf" && <CompressPdf />}
      {activeTool === "jpg-pdf" && <JpgToPdf />}
      {activeTool === "pdf-signer" && <PdfSigner />}
      {activeTool === "ocr-tool" && <OCRTool />}
    </section>
  );
}
