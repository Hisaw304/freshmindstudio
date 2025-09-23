/* api/remove-bg.js */
const axios = require("axios");
const FormData = require("form-data");

module.exports = async (req, res) => {
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
    // Expect JSON body { imageBase64: 'data:image/png;base64,...' }
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      res.status(400).json({ error: "No imageBase64 field provided" });
      return;
    }

    // remove data prefix if exists
    const b64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // prepare form
    const form = new FormData();
    form.append("image_file_b64", b64);
    // optional params: size, format, bg_color etc.
    // form.append('size', 'auto');

    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      form,
      {
        headers: {
          ...form.getHeaders(),
          "X-Api-Key": apiKey,
        },
        responseType: "arraybuffer", // we want binary
      }
    );

    const contentType = response.headers["content-type"] || "image/png";
    const jsonB64 = Buffer.from(response.data, "binary").toString("base64");
    const dataUrl = `data:${contentType};base64,${jsonB64}`;

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ success: true, imageBase64: dataUrl });
  } catch (err) {
    console.error("remove-bg error:", err.response?.data || err.message || err);
    const status = err.response?.status || 500;
    const message =
      err.response?.data?.errors || err.message || "Unknown error";
    res.status(status).json({ error: message });
  }
};
