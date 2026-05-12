// src/components/ai-media/AiMediaTools.jsx

import { useState } from "react";

import AiUpscaler from "./AiUpscaler";
import ObjectRemover from "./ObjectRemover";
import BackgroundGenerator from "./BackgroundGenerator";
import ImageEnhancer from "./ImageEnhancer";
import FaceRestoration from "./FaceRestoration";
import AiRecolor from "./AiRecolor";

export default function AiMediaTools() {
  const [activeTool, setActiveTool] = useState("ai-upscaler");

  return (
    <section className="fm-ai-media">
      {/* HEADER */}

      <div className="fm-ai-media-header">
        <h1>
          AI Media <span className="fm-st-highlight">Tools</span>
        </h1>

        <p>
          Enhance, upscale, recolor, restore, and edit images directly in your
          browser with modern AI-powered tools.
        </p>
      </div>

      {/* TOOL SELECTOR */}

      <div className="fm-ai-media-selector-wrap">
        <select
          className="fm-ai-media-selector"
          value={activeTool}
          onChange={(e) => setActiveTool(e.target.value)}
        >
          <option value="ai-upscaler">AI Upscaler</option>

          <option value="object-remover">Object Remover</option>

          <option value="background-generator">Background Generator</option>

          <option value="image-enhancer">Image Enhancer</option>

          <option value="face-restoration">Face Restoration</option>

          <option value="ai-recolor">AI Recolor</option>
        </select>
      </div>

      {/* ACTIVE TOOL */}

      {activeTool === "ai-upscaler" && <AiUpscaler />}

      {activeTool === "object-remover" && <ObjectRemover />}

      {activeTool === "background-generator" && <BackgroundGenerator />}

      {activeTool === "image-enhancer" && <ImageEnhancer />}

      {activeTool === "face-restoration" && <FaceRestoration />}

      {activeTool === "ai-recolor" && <AiRecolor />}
    </section>
  );
}
