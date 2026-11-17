-- Run once in Cloudflare D1 before enabling the newsletter endpoint.
-- Never publish or commit exported subscriber data.
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','unsubscribed')),
  confirmation_token_hash TEXT UNIQUE,
  confirmation_expires_at TEXT,
  unsubscribe_token_hash TEXT UNIQUE,
  requested_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmation_sent_at TEXT,
  confirmed_at TEXT,
  unsubscribed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_confirm_token ON subscribers(confirmation_token_hash);
CREATE INDEX IF NOT EXISTS idx_subscribers_unsub_token ON subscribers(unsubscribe_token_hash);
