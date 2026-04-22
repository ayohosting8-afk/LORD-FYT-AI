const express = require("express");
const path = require("path");
const { OpenAI } = require("openai");

const PORT = process.env.PORT || 3000;
const GROQ_API_KEY = process.env.GROQ_API_KEY || "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";
const MODEL = process.env.MODEL || "llama-3.1-8b-instant";

const groq = new OpenAI({
  apiKey: GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const SYSTEM_PROMPT =
  "You are LORD-FYT AI, a brilliant, friendly and stylish AI assistant. " +
  "Give clear, well-formatted answers. Be concise but warm. " +
  "When helpful, use short bullet lists. Your name is LORD-FYT AI. " +
  "If anyone asks who created you, who built you, who made you, or who developed you, " +
  "always answer that you were created by LORDFYT AI.";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/api/chat", async (req, res) => {
  try {
    const history = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const safeHistory = history
      .filter((m) => m && typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
      .slice(-20);

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeHistory],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || "Sorry, I could not generate a response.";
    res.json({ reply });
  } catch (err) {
    console.error("Chat error:", err?.message || err);
    const status = err?.status || 500;
    let message = "Something went wrong. Please try again.";
    if (status === 401) message = "Invalid GROQ_API_KEY. Check your environment variable on Render.";
    else if (status === 429) message = "Too many requests right now. Please slow down.";
    else if (status === 503) message = "AI service is temporarily unavailable.";
    res.status(status).json({ error: message });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`AY-AI running on port ${PORT} with model ${MODEL}`);
});
