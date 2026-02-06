const express = require("express");
const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));


// ================= EMAIL CONFIG =================

// CHANGE THESE
const EMAIL_USER = "overflowedpixels@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS; // App password


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});


// ================= API =================

app.post("/test", async (req, res) => {
  try {

    // 1. Load Template
    const content = fs.readFileSync("template.docx", "binary");

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip);

    // 2. Fill Data
    doc.render(req.body);

    // 3. Generate DOCX
    const buffer = doc
      .getZip()
      .generate({ type: "nodebuffer" });


    // 4. Send Email (if email exists)
    if (req.body.EPC_Email) {

      await transporter.sendMail({

        from: `"Premier Energies" <${EMAIL_USER}>`,

        to: "penguinninja8@gmail.com", // Receiver

        subject: "Warranty Certificate",

        text: "Please find your warranty certificate attached.",

        attachments: [
          {
            filename: "warranty-certificate.docx",
            content: buffer,
          },
        ],
      });

      console.log("Email sent successfully");
    }


    // 5. Send File to Frontend
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.docx"
    );

    res.send(buffer);

  } catch (err) {

    console.error("Server Error:", err);

    res.status(500).json({
      error: "Failed to generate and send document",
      details: err.message,
    });
  }
});


// ================= START =================

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
