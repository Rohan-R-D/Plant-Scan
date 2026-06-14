require("dotenv").config();
const express = require("express");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Configure multer
const upload = multer({ dest: "upload/" });
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

// ROUTES

// Analyze Endpoint
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const imagePath = req.file.path;
    const imageData = await fsPromises.readFile(imagePath, {
      encoding: "base64",
    });

    let plantInfo = null;

    try {
      // 1. Construct the direct REST API endpoint url with the key appended as a query parameter
      const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY.trim()}`;

      // 2. Execute a raw HTTP fetch request
      // CRITICAL: No "Authorization" or "x-goog-api-key" headers are passed here.
      // This prevents Google's servers from throwing the ACCESS_TOKEN_TYPE_UNSUPPORTED exception.
      const response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { 
                  text: "Analyze this plant image and provide detailed analysis of its species, health, and care recommendations, its characteristics, care instructions, and any interesting facts. Please provide the response in plain text without using any markdown formatting." 
                },
                {
                  inlineData: {
                    mimeType: req.file.mimetype,
                    data: imageData,
                  },
                },
              ],
            },
          ],
        }),
      });

      const jsonResult = await response.json();

      if (!response.ok) {
        throw new Error(jsonResult.error?.message || `HTTP Error ${response.statusCode}`);
      }

      // Extract the text content cleanly from Google's standard response schema
      plantInfo = jsonResult.candidates[0].content.parts[0].text;

    } catch (err) {
      console.error("Direct API call failed:", err.message);
      return res.status(502).json({
        error: `Failed to communicate with Gemini API: ${err.message}`,
      });
    }

    // Clean up: delete the uploaded file
    await fsPromises.unlink(imagePath);

    // Respond with the analysis result and the image data
    res.json({
      result: plantInfo,
      image: `data:${req.file.mimetype};base64,${imageData}`,
    });

  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: "An error occurred while analyzing the image" });
  }
});

// Download PDF Endpoint
app.post("/download", express.json(), async (req, res) => {
  const { result, image } = req.body;
  try {
    const reportsDir = path.join(__dirname, "reports");
    await fsPromises.mkdir(reportsDir, { recursive: true });

    const filename = `plant_analysis_report_${Date.now()}.pdf`;
    const filePath = path.join(reportsDir, filename);
    const writeStream = fs.createWriteStream(filePath);
    const doc = new PDFDocument();
    doc.pipe(writeStream);

    doc.fontSize(24).text("Plant Analysis Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();
    doc.fontSize(12).text(result, { align: "left" });

    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      doc.moveDown();
      doc.image(buffer, {
        fit: [500, 300],
        align: "center",
        valign: "center",
      });
    }
    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    res.download(filePath, (err) => {
      if (err) {
        if (!res.headersSent) {
          res.status(500).json({ error: "Error downloading the PDF report" });
        }
      }
      fsPromises.unlink(filePath).catch(console.error);
    });
  } catch (error) {
    console.error("Error generating PDF report:", error);
    res.status(500).json({ error: "An error occurred while generating the PDF report" });
  }
});

// Health Endpoint
app.get("/health", (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(502).json({ ok: false, error: "Missing GEMINI_API_KEY in .env file." });
  }
  return res.json({ ok: true, status: "REST Core Routing Engine Ready" });
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log("App running in pure REST mode to bypass SDK verification bugs.");
});