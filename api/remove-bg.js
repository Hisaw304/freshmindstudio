// api/remove-bg.js
import axios from "axios";
import FormData from "form-data";

const MAX_BASE64_LENGTH = 6_000_000; // ~6MB base64 length safeguard

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    console.error("REMOVE_BG_API_KEY missing from env");
    res.status(500).json({
      success: false,
      error: "Missing REMOVE_BG_API_KEY in environment",
    });
    return;
  }

  try {
    // Accept JSON body: { imageBase64: "data:image/png;base64,..." } or plain base64 string
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    let { imageBase64 } = body || {};

    if (!imageBase64) {
      return res
        .status(400)
        .json({ success: false, error: "No imageBase64 field provided" });
    }

    // If DataURL format, extract mime + base64; otherwise accept plain base64
    const dataUrlMatch = String(imageBase64).match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
    );
    let mime = "image/png";
    let b64 = String(imageBase64);

    if (dataUrlMatch) {
      mime = dataUrlMatch[1];
      b64 = dataUrlMatch[2];
    } else {
      // strip whitespace/newlines
      b64 = b64.replace(/\s/g, "");
      if (!/^[A-Za-z0-9+/=]+$/.test(b64)) {
        return res.status(400).json({
          success: false,
          error: "imageBase64 is not valid base64 data",
        });
      }
    }

    // Basic size safeguard
    if (b64.length > MAX_BASE64_LENGTH) {
      return res.status(413).json({ success: false, error: "Image too large" });
    }

    // Build form-data for remove.bg
    const form = new FormData();
    form.append("image_file_b64", b64);
    form.append("size", "preview"); // use preview to keep response sizes reasonable

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "X-Api-Key": apiKey,
        },
        responseType: "arraybuffer",
        maxContentLength: 50_000_000,
        maxBodyLength: 50_000_000,
      }
    );

    const contentType = response.headers["content-type"] || mime || "image/png";
    const outB64 = Buffer.from(response.data, "binary").toString("base64");
    const dataUrlOut = `data:${contentType};base64,${outB64}`;

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ success: true, imageBase64: dataUrlOut });
  } catch (err) {
    // robust logging for Vercel logs (you'll see this in Functions logs)
    console.error("remove-bg error full:", {
      message: err?.message,
      stack: err?.stack,
      status: err?.response?.status,
      responseData: err?.response?.data,
      responseHeaders: err?.response?.headers,
    });

    const status = err?.response?.status || 500;
    const apiMsg =
      err?.response?.data?.errors?.[0]?.title ||
      err?.response?.data?.title ||
      (typeof err?.response?.data === "string" ? err.response.data : null) ||
      err?.message ||
      "Unknown error from remove.bg";

    // Return helpful payload to browser for debugging (remove 'raw' in prod if you want)
    return res.status(status).json({
      success: false,
      error: apiMsg,
      raw: err?.response?.data ?? null,
    });
  }
}
