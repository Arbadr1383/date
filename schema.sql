CREATE TABLE IF NOT EXISTS responses (
  id TEXT PRIMARY KEY,
  answer TEXT NOT NULL CHECK (answer IN ('yes', 'maybe', 'no')),
  place TEXT,
  jalali_date TEXT,
  time TEXT,
  phone TEXT,
  source TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at DESC);
