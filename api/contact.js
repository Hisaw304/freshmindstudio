// api/contact.js

import sgMail from "@sendgrid/mail";
import formidable from "formidable";
import fs from "fs";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/* =========================
   DISABLE BODY PARSER
========================= */

export const config = {
  api: {
    bodyParser: false,
  },
};

/* =========================
   HANDLER
========================= */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
    });
  }

  try {
    /* =========================
       PARSE FORM
    ========================= */

    const form = formidable({
      multiples: false,
    });

    const [fields, files] = await form.parse(req);

    const name = fields.name?.[0];
    const email = fields.email?.[0];
    const company = fields.company?.[0];
    const service = fields.service?.[0];
    const message = fields.message?.[0];

    /* =========================
       VALIDATION
    ========================= */

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    /* =========================
       ATTACHMENTS
    ========================= */

    let attachments = [];

    if (files.file?.[0]) {
      const uploadedFile = files.file[0];

      const fileContent = fs
        .readFileSync(uploadedFile.filepath)
        .toString("base64");

      attachments.push({
        content: fileContent,
        filename: uploadedFile.originalFilename,
        type: uploadedFile.mimetype,
        disposition: "attachment",
      });
    }

    /* =========================
       EMAIL
    ========================= */

    const msg = {
      to: "hello@focusstudio.com",
      from: "hello@focusstudio.com",

      subject: `New Contact Submission - ${service}`,

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>New Contact Form Submission</h2>

          <p><strong>Name:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Company:</strong> ${company || "Not provided"}</p>

          <p><strong>Service:</strong> ${service}</p>

          <hr style="margin: 20px 0;" />

          <p><strong>Message:</strong></p>

          <p style="line-height: 1.7;">
            ${message}
          </p>
        </div>
      `,

      attachments,
    };

    await sgMail.send(msg);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}
