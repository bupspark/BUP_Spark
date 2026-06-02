import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { jsonrepair } from "jsonrepair";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: "50mb" }));

  // Initialize Gemini dynamically per request to support on-the-fly API key updates
  const getAi = () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please configuration your Gemini API Key in the AI Studio Settings (Env Variables).");
    }
    return new GoogleGenAI({ 
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const startTime = Date.now();
    const { prompt, system, isJson } = req.body;
    console.log(`[API /api/chat] Request started. isJson: ${!!isJson}, Prompt length: ${prompt?.length || 0}`);
    try {
      const aiClient = getAi();
      
      const config: any = {
        systemInstruction: system || "",
        maxOutputTokens: 8192,
      };

      if (isJson) {
        config.responseMimeType = "application/json";
      }

      const response = await aiClient.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config,
      });

      let raw = response.text || "";
      console.log(`[API /api/chat] Successful model response in ${Date.now() - startTime}ms. Raw text length: ${raw.length}`);

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
      console.error(`[API /api/chat] Error after ${Date.now() - startTime}ms:`, error);
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
