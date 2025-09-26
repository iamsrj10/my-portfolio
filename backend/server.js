require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors()); // restrict origin in production
app.use(express.json());
// Simple health/test route
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));


const CONTACT_TO = process.env.CONTACT_TO || "rabinjeo@gmail.com";
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e||"").trim());

app.post("/api/contact", async (req, res) => {
  try {
    const { name = "", email, message } = req.body;

    // validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: "Invalid or missing sender email." });
    }
    if (!message || !message.toString().trim()) {
      return res.status(400).json({ error: "Message cannot be empty." });
    }

    // If SMTP env missing, create an Ethereal test account so we can validate flow locally
    let transporter;
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("SMTP env missing — creating Ethereal test account for local testing.");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
    }

    // Verify connection / auth before sending
    try {
      await transporter.verify();
      console.log("SMTP connection verified.");
    } catch (verifyErr) {
      console.error("SMTP verify failed:", verifyErr && verifyErr.message, verifyErr);
      return res.status(502).json({ error: "SMTP connection/credentials problem. Check server logs." });
    }

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.SMTP_USER || "no-reply@example.com"}>`,
      to: process.env.CONTACT_TO || "rabinjeo@gmail.com",
      subject: `New message from portfolio — ${name || "Anonymous"}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info && info.messageId);

    // If we used Ethereal, include preview URL in the response & logs
    if (info && nodemailer.getTestMessageUrl(info)) {
      const preview = nodemailer.getTestMessageUrl(info);
      console.log("Preview URL:", preview);
      return res.json({ ok: true, previewUrl: preview });
    }

    return res.json({ ok: true });
  } catch (err) {
    // log full error details so you can paste them here if needed
    console.error("sendMail error (full):", err && err.message, err && err.stack, err && err.response);
    return res.status(500).json({ error: "Server error while sending message. Check server logs." });
  }
});
// --- add this at the bottom of server.js ---
const PORT = Number(process.env.PORT) || 4000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
});

// optional: graceful shutdown on SIGINT/SIGTERM
process.on("SIGINT", () => {
  console.log("Shutting down server (SIGINT)...");
  server.close(() => process.exit(0));
});
process.on("SIGTERM", () => {
  console.log("Shutting down server (SIGTERM)...");
  server.close(() => process.exit(0));
});

