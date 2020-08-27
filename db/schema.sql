DROP TABLE IF EXISTS avatars;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles_categories;

CREATE TABLE avatars
(
  id SERIAL PRIMARY KEY,
  regular VARCHAR(50) NOT NULL,
  small VARCHAR(50) NOT NULL
);

CREATE TABLE authors
(
  id SERIAL PRIMARY KEY,
  firstname VARCHAR(50) NOT NULL,
  lastname VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  avatar_id INTEGER NOT NULL,
  FOREIGN KEY (avatar_id) REFERENCES avatars (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE articles
(
  id SERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  announce VARCHAR(500) NOT NULL,
  full_text TEXT NOT NULL,
  picture VARCHAR(50) NOT NULL,
  created_date DATE NOT NULL,
  author_id INTEGER NOT NULL,
  FOREIGN KEY (author_id) REFERENCES authors (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE comments
(
  id SERIAL PRIMARY KEY,
  comment VARCHAR(100) NOT NULL,
  created_date DATE NOT NULL,
  author_id INTEGER NOT NULL,
  article_id INTEGER NOT NULL,
  FOREIGN KEY (author_id) REFERENCES authors (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE categories
(
  id SERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL
);

CREATE TABLE articles_categories
(
  article_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
