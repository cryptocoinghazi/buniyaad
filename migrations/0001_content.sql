CREATE TABLE site_content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  body TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);
CREATE TABLE media (
  id TEXT PRIMARY KEY,
  original_type TEXT NOT NULL,
  original_name TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE project_redirects (
  slug TEXT PRIMARY KEY,
  project_id TEXT NOT NULL
);
