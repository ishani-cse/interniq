import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import pdf from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";
import { fetchLinkedInJobs } from "./services/apifyService.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "InternIQ Backend is working!" });
});

// ---------- Apify cache (saves credits) ----------
// Same search = no new Apify run for 12 hours.
// Also merges identical requests that arrive at the same time
// (e.g. React dev double-render) into one Apify run.
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 200;
const jobsCache = new Map(); // key -> { jobs, time }
const pendingJobs = new Map(); // key -> Promise

const getJobsCached = async ({ keyword, location, limit }) => {
  const key = `${keyword}|${location}|${limit}`.trim().toLowerCase();

  const hit = jobsCache.get(key);
  if (hit && Date.now() - hit.time < CACHE_TTL_MS) {
    return hit.jobs;
  }

  if (pendingJobs.has(key)) return pendingJobs.get(key);

  const promise = (async () => {
    try {
      const jobs = await fetchLinkedInJobs({ keyword, location, limit });
      // Don't cache empty results, so a bad run can be retried
      if (jobs.length) {
        if (jobsCache.size >= MAX_CACHE_ENTRIES) {
          jobsCache.delete(jobsCache.keys().next().value);
        }
        jobsCache.set(key, { jobs, time: Date.now() });
      }
      return jobs;
    } catch (error) {
      // If Apify fails (e.g. no credits), serve older cached data if we have it
      if (hit) return hit.jobs;
      throw error;
    } finally {
      pendingJobs.delete(key);
    }
  })();

  pendingJobs.set(key, promise);
  return promise;
};

// Test route: Apify + LinkedIn jobs
app.get("/api/test-jobs", async (req, res) => {
  try {
    const jobs = await fetchLinkedInJobs({
      keyword: "Frontend Developer",
      location: "India",
      limit: 3,
    });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error("Apify Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
});

// Frontend: /api/recommendations?q=react intern&location=India&limit=10
app.get("/api/recommendations", async (req, res) => {
  try {
    const { q = "software intern", location = "India", limit = 10 } = req.query;
    const jobs = await getJobsCached({
      keyword: String(q),
      location: String(location),
      limit: Math.min(Number(limit) || 10, 25),
    });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error("Apify Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------- Resume parsing (PDF / DOCX -> plain text) ----------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Wrapper so multer errors (like file too large) return clean JSON
const handleUpload = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      const error =
        err.code === "LIMIT_FILE_SIZE"
          ? "File size must be under 5 MB."
          : "File upload failed.";
      return res.status(400).json({ success: false, error });
    }
    next();
  });
};

app.post("/api/resume/parse", handleUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file received." });
    }

    const { buffer, originalname } = req.file;
    const name = originalname.toLowerCase();
    let text = "";

    if (name.endsWith(".pdf")) {
      text = (await pdf(buffer)).text;
    } else if (name.endsWith(".docx")) {
      text = (await mammoth.extractRawText({ buffer })).value;
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Please upload a PDF or DOCX file." });
    }

    if (!text.trim()) {
      return res.status(400).json({
        success: false,
        error:
          "Could not read text from this file. Scanned PDFs are not supported.",
      });
    }

    res.json({ success: true, text });
  } catch (error) {
    console.error("Resume parse error:", error.message);
    res
      .status(400)
      .json({ success: false, error: "Could not read this resume." });
  }
});

// Surface any hidden error in the terminal
process.on("unhandledRejection", (err) =>
  console.error("Unhandled rejection:", err),
);
process.on("uncaughtException", (err) =>
  console.error("Uncaught exception:", err),
);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error("Server failed to start:", err.message);
    process.exit(1);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Change PORT in .env (for example 5002).`,
    );
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});