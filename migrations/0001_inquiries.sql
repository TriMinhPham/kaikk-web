-- Inquiry storage for POST /api/inquiry (functions/api/inquiry.ts).
-- Personal data: name, email, company, message. Retention: see INQUIRY_RETENTION_MONTHS
-- in src/lib/inquiry-rules.ts (rows older than that are deleted by the API).

CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL UNIQUE,              -- shown to the visitor, e.g. KAI-7F3Q-9XMD
  created_at TEXT NOT NULL,              -- ISO 8601 UTC
  locale TEXT NOT NULL CHECK (locale IN ('ja', 'en')),
  topic TEXT,                            -- one of INQUIRY_TOPICS or NULL
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  email_status TEXT NOT NULL DEFAULT 'disabled' CHECK (email_status IN ('disabled', 'pending', 'sent', 'failed')),
  notified_at TEXT,                      -- ISO 8601 UTC; NULL = nobody has been told yet (set by an external poller or by email)
  handled_at TEXT                        -- optional: set manually when answered
);
CREATE INDEX IF NOT EXISTS inquiries_created_at ON inquiries (created_at);
CREATE INDEX IF NOT EXISTS inquiries_unnotified ON inquiries (notified_at, created_at);

-- Rate limiting only. ip_hash is an HMAC-SHA-256 of the IP address; raw IPs are never stored.
CREATE TABLE IF NOT EXISTS rate_events (
  ip_hash TEXT NOT NULL,
  created_at INTEGER NOT NULL            -- Unix epoch milliseconds
);
CREATE INDEX IF NOT EXISTS rate_events_ip_time ON rate_events (ip_hash, created_at);
