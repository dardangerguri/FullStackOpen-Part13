CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Full Stack', 'https://fullstack.com', 'Full Stack 13');
INSERT INTO blogs (author, url, title) VALUES ('D.G.', 'https://test.com', 'Testing relational databases');
