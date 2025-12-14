
const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: "uploads/" });

const db = new sqlite3.Database("data.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    ngo_id TEXT,
    month TEXT,
    people_helped INTEGER,
    events_conducted INTEGER,
    funds_utilized REAL,
    UNIQUE(ngo_id, month)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    total INTEGER,
    processed INTEGER,
    success INTEGER,
    failed INTEGER,
    status TEXT
  )`);
});

app.post("/report", (req, res) => {
  const { ngo_id, month, people_helped, events_conducted, funds_utilized } = req.body;
  if (!ngo_id || !month) return res.status(400).json({ error: "Invalid data" });

  db.run(
    "INSERT OR IGNORE INTO reports VALUES (?, ?, ?, ?, ?, ?)",
    [uuidv4(), ngo_id, month, people_helped, events_conducted, funds_utilized],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

app.post("/reports/upload", upload.single("file"), (req, res) => {
  const jobId = uuidv4();
  let total = 0, success = 0, failed = 0;

  db.run("INSERT INTO jobs VALUES (?, 0, 0, 0, 0, 'processing')", [jobId]);

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => {
      total++;
      db.run(
        "INSERT OR IGNORE INTO reports VALUES (?, ?, ?, ?, ?, ?)",
        [uuidv4(), row.ngo_id, row.month, row.people_helped, row.events_conducted, row.funds_utilized],
        (err) => {
          if (err) failed++;
          else success++;
        }
      );
    })
    .on("end", () => {
      db.run(
        "UPDATE jobs SET total=?, processed=?, success=?, failed=?, status='completed' WHERE id=?",
        [total, total, success, failed, jobId]
      );
    });

  res.json({ job_id: jobId });
});

app.get("/job-status/:id", (req, res) => {
  db.get("SELECT * FROM jobs WHERE id=?", [req.params.id], (err, row) => {
    res.json(row);
  });
});

app.get("/dashboard", (req, res) => {
  const month = req.query.month;
  db.get(
    `SELECT COUNT(DISTINCT ngo_id) AS ngos,
            SUM(people_helped) AS people,
            SUM(events_conducted) AS events,
            SUM(funds_utilized) AS funds
     FROM reports WHERE month=?`,
    [month],
    (err, row) => res.json(row)
  );
});

app.listen(4000, () => console.log("Backend running on http://localhost:4000"));
