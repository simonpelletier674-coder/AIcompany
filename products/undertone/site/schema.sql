-- Undertone D1 schema (database "undertone").
-- Run via wrangler d1 execute / Cloudflare MCP — not applied by this repo automatically.

-- Existing waitlist table (kept here, idempotent, for reference/completeness).
CREATE TABLE IF NOT EXISTS waitlist (
  email   TEXT PRIMARY KEY,
  ts      TEXT,
  ua      TEXT,
  ref     TEXT,
  country TEXT
);

-- New: CSV-upload MVP report storage. One row per generated report.
CREATE TABLE IF NOT EXISTS reports (
  id           TEXT PRIMARY KEY,   -- random 32-char hex id, used in /report/<id>
  email        TEXT NOT NULL,      -- gates access to the report; also feeds waitlist
  created_ts   TEXT NOT NULL,      -- ISO 8601 timestamp
  review_count INTEGER NOT NULL,   -- number of reviews included in the analysis
  report_json  TEXT NOT NULL       -- full report payload (themes, quotes, drafted actions)
);

CREATE INDEX IF NOT EXISTS idx_reports_email ON reports(email);
CREATE INDEX IF NOT EXISTS idx_reports_created_ts ON reports(created_ts);
