-- V2: Seed default programming languages
-- Inserts the four default languages: Java, Python, C, C++

INSERT INTO programming_languages (name, api_identifier) VALUES
  ('Java', 'java') ON CONFLICT (name) DO NOTHING,
  ('Python', 'python') ON CONFLICT (name) DO NOTHING,
  ('C', 'c') ON CONFLICT (name) DO NOTHING,
  ('C++', 'cpp') ON CONFLICT (name) DO NOTHING;
