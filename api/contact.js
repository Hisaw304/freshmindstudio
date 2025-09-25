import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, company, service, budget, message, attachments } =
      req.body;

    const formattedAttachments = (attachments || []).map((file) => {
      // file.content is expected to be a Data URL: "data:image/png;base64,AAAA..."
      const base64Content = file.content.includes("base64,")
        ? file.content.split("base64,")[1]
        : file.content;

      return {
        content: base64Content,
        filename: file.filename || "attachment",
        type: file.type || "application/octet-stream",
        disposition: "attachment",
      };
    });

    const msg = {
      to: "fishlymind@gmail.com", // inbox
      from: "fishlymind@gmail.com", // must be a verified sender in SendGrid
      subject: `New Contact Form Submission from ${name || "Unknown"}`,
      html: `
        <p><strong>Name:</strong> ${name || "-"}</p>
        <p><strong>Email:</strong> ${email || "-"}</p>
        <p><strong>Company:</strong> ${company || "-"}</p>
        <p><strong>Service:</strong> ${service || "-"}</p>
        <p><strong>Budget:</strong> ${budget || "-"}</p>
        <p><strong>Message:</strong><br/>${message || "-"}</p>
      `,
      attachments: formattedAttachments,
    };

    await sgMail.send(msg);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("SendGrid error:", err.response?.body || err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}
