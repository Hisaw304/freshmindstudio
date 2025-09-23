// api/remove-bg.js (ESM)
import axios from "axios";
import FormData from "form-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.REMOVE_BG_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Missing REMOVE_BG_API_KEY in environment" });
    return;
  }

  try {
    let body = {};
    try {
      body =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    } catch (e) {
      return res.status(400).json({ error: "Invalid JSON body" });
    }

    const { imageBase64 } = body;
    if (!imageBase64) {
      res.status(400).json({ error: "No imageBase64 field provided" });
      return;
    }

    const b64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const form = new FormData();
    form.append("image_file_b64", b64);
    form.append("size", "preview");

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "X-Api-Key": apiKey,
        },
        responseType: "arraybuffer",
      }
    );

    const contentType = response.headers["content-type"] || "image/png";
    const jsonB64 = Buffer.from(response.data, "binary").toString("base64");
    const dataUrl = `data:${contentType};base64,${jsonB64}`;

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ success: true, imageBase64: dataUrl });
  } catch (err) {
    console.error("remove-bg error details:", {
      status: err.response?.status,
      headers: err.response?.headers,
      data: err.response?.data,
      message: err.message,
    });

    const status = err.response?.status || 500;
    const errorMsg =
      err.response?.data?.errors?.[0]?.title ||
      err.response?.data?.title ||
      err.message ||
      "Unknown error from remove.bg";

    res.status(status).json({
      success: false,
      error: errorMsg,
      raw: err.response?.data,
    });
  }
}
