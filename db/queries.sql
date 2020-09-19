--------------------------------
-- 1. Получить список всех категорий
-- (идентификатор,
-- наименование категории);
SELECT
  categories.id AS "Id",
 categories.category AS "Категория"
FROM categories;

--------------------------------
-- 2. Получить список категорий для которых создана минимум одна публикация
-- (идентификатор,
-- наименование категории);
SELECT DISTINCT
  categories.id AS "Id",
  categories.category AS "Категория"
FROM
  categories
    INNER JOIN articles_categories ON categories.id = articles_categories.category_id
ORDER BY (categories.id);

--------------------------------
-- 3. Получить список категорий с количеством публикаций
-- (идентификатор,
-- наименование категории,
-- количество публикаций в категории);
SELECT
  categories.id AS "Id",
  categories.category AS "Категория",
  COUNT(articles_categories.article_id) AS "Кол-во публикаций"
FROM
  categories
    INNER JOIN articles_categories ON categories.id = articles_categories.category_id
GROUP BY
  categories.id,
  categories.category
ORDER BY (categories.id);

--------------------------------
-- 4. Получить список публикаций
-- (идентификатор публикации,
-- заголовок публикации,
-- анонс публикации,
-- дата публикации,
-- имя и фамилия автора,
-- контактный email,
-- количество комментариев,
-- наименование категорий).
-- Сначала свежие публикации;
SELECT
  articles.id AS "Id",
  articles.title AS "Заголовок",
  articles.announce AS "Анонс",
  articles.created_date AS "Дата",
  authors.firstname AS "Имя автора",
  authors.lastname AS "Фамилия",
  authors.email AS "E-mail",
  COUNT(comments.id) AS "Кол-во комментариев",
  categories.list AS "Кол-во категорий"
FROM
  articles
    INNER JOIN authors ON articles.author_id = authors.id
    INNER JOIN comments ON articles.id = comments.article_id
    INNER JOIN
      (
        SELECT
          articles.id AS "article_id",
          STRING_AGG(categories.category, ', ') AS "list"
        FROM articles_categories
          LEFT JOIN articles ON articles.id = articles_categories.article_id
          LEFT JOIN categories ON categories.id = articles_categories.category_id
        GROUP BY
          articles.id
      ) categories ON articles.id = categories.article_id
GROUP BY
  articles.id,
  articles.title,
  articles.announce,
  articles.created_date,
  authors.firstname,
  authors.lastname,
  authors.email,
  categories.list
ORDER BY articles.created_date DESC;

--------------------------------
-- 5. Получить полную информацию определённой публикации
-- (идентификатор публикации,
-- заголовок публикации,
-- анонс,
-- полный текст публикации,
-- дата публикации,
-- путь к изображению,
-- имя и фамилия автора,
-- контактный email,
-- количество комментариев,
-- наименование категорий);
SELECT
  articles.id AS "Id",
  articles.title AS "Заголовок",
  articles.announce AS "Анонс",
  articles.full_text AS "Полный текст",
  articles.created_date AS "Дата",
  articles.picture AS "Изображение",
  authors.firstname AS "Имя автора",
  authors.lastname AS "Фамилия",
  authors.email AS "E-mail",
  COUNT(comments.id) AS "Кол-во комментариев",
  categories.list AS "Кол-во категорий"
FROM
  articles
    INNER JOIN authors ON articles.author_id = authors.id
    INNER JOIN comments ON articles.id = comments.article_id
    INNER JOIN
  (
    SELECT
      articles.id AS "article_id",
      STRING_AGG(categories.category, ', ') AS "list"
    FROM articles_categories
      LEFT JOIN articles ON articles.id = articles_categories.article_id
      LEFT JOIN categories ON categories.id = articles_categories.category_id
    GROUP BY
      articles.id
  ) categories ON articles.id = categories.article_id
GROUP BY
  articles.id,
  articles.title,
  articles.announce,
  articles.full_text,
  articles.created_date,
  articles.picture,
  authors.firstname,
  authors.lastname,
  authors.email,
  categories.list
ORDER BY articles.id;

--------------------------------
-- 6. Получить список из 5 свежих комментариев
-- (идентификатор комментария,
-- идентификатор публикации,
-- имя и фамилия автора,
-- текст комментария);
SELECT
  comments.id AS "Id комментария",
  articles.id AS "Id публикации",
  authors.firstname AS "Имя автора",
  authors.lastname AS "Фамилия",
  comments.comment AS "Текст комментария"
FROM
  comments
    INNER JOIN articles ON articles.id = comments.article_id
    INNER JOIN authors ON comments.author_id = authors.id
GROUP BY
  comments.id,
  articles.id,
  authors.firstname,
  authors.lastname,
  comments.comment
ORDER BY
  comments.created_date DESC
LIMIT 5;

--------------------------------
-- 7. Получить список комментариев для определённой публикации
-- (идентификатор комментария,
-- идентификатор публикации,
-- имя и фамилия автора,
-- текст комментария).
-- Сначала новые комментарии;
SELECT
  comments.id AS "Id комментария",
  articles.id AS "Id публикации",
  authors.firstname AS "Имя автора",
  authors.lastname AS "Фамилия",
  comments.comment AS "Текст комментария"
FROM
  comments
    INNER JOIN articles ON articles.id = comments.article_id
    INNER JOIN authors ON comments.author_id = authors.id
WHERE articles.id = 2
GROUP BY
  comments.id,
  articles.id,
  authors.firstname,
  authors.lastname,
  comments.comment
ORDER BY
  comments.created_date DESC;


-- 8. Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE articles
  SET title = 'Как я встретил Новый год'
WHERE articles.id = 1;
