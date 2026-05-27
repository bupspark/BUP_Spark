import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // Initialize Gemini
  let ai: GoogleGenAI | null = null;
  const getAi = () => {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is required.");
      }
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
  };

  // API Routes
  app.post("/api/gemini", async (req, res) => {
    try {
      const aiClient = getAi();
      const { prompt, system, isJson } = req.body;
      
      const config: any = {
        systemInstruction: system || "",
        maxOutputTokens: 8192,
      };

      if (isJson) {
        config.responseMimeType = "application/json";
      }

      const response = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config,
      });

      let raw = response.text || "";

      if (isJson) {
        let clean = raw.replace(/```json|```/g, "").trim();
        const startObj = clean.indexOf("{");
        const startArr = clean.indexOf("[");
        const isObj = startObj !== -1 && (startArr === -1 || startObj < startArr);
        const start = isObj ? startObj : startArr;
        const end = isObj ? clean.lastIndexOf("}") : clean.lastIndexOf("]");
        
        if (start !== -1 && end !== -1) {
          clean = clean.slice(start, end + 1);
        }

        try {
          const parsed = JSON.parse(clean);
          res.json({ result: parsed });
        } catch (err) {
          try {
            const repaired = jsonrepair(clean);
            res.json({ result: JSON.parse(repaired) });
          } catch (repairErr) {
             console.error("JSON repair failed", repairErr);
             res.status(500).json({ error: "Failed to parse AI response as JSON" });
          }
        }
      } else {
        res.json({ result: raw });
      }

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
