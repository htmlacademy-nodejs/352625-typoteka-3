'use strict';

const avatars = [
  {regular: `avatar-1`, small: `avatar-small-1`},
  {regular: `avatar-2`, small: `avatar-small-2`},
  {regular: `avatar-3`, small: `avatar-small-3`},
];

const authors = [
  {
    firstname: `Анна`,
    lastname: `Артамонова`,
    email: `artamonova_a@yandex.ru`,
    password: `qwerty123`,
    avatar_id: `3`,
  },
  {
    firstname: `Владимир`,
    lastname: `Назаров`,
    email: `nazarov_v@gmail.com`,
    password: `password321`,
    avatar_id: `2`,
  },
  {
    firstname: `Мария`,
    lastname: `Власова`,
    email: `vlasova_m@mail.ru`,
    password: `ytrewq123`,
    avatar_id: `1`,
  },
];

const auths = [
  {author_id: 1, is_auth: true},
  {author_id: 2, is_auth: false},
  {author_id: 3, is_auth: false},
];

const articles = [
  {
    title: `Самый лучший музыкальный альбом этого года`,
    announce: `Стоит только немного постараться и запастись книгами. Собрать камни бесконечности легко, если вы прирожденный герой. Альбом стал настоящим открытием года. Это один из лучших рок-музыкантов.`,
    full_text: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Игры и программирование разные вещи. Он написал больше 30 хитов. Рок-музыка всегда ассоциировалась с протестами. Освоить вёрстку несложно. Маленькими шагами. Он обязательно понравится геймерам со стажем. Процессор заслуживает особого внимания.`,
    picture: `sea`,
    created_date: `2019-08-12`,
    author_id: 2,
  },
  {
    title: `Ёлки. История деревьев.`,
    announce: `Ёлки — это не просто красивое дерево. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха.`,
    full_text: `Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь. Первая большая ёлка была установлена только в 1938 году. Так ли это на самом деле? Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Просто действуйте. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха.`,
    picture: `forest`,
    created_date: `2019-01-01`,
    author_id: 2,
  },
  {
    title: `Собрать камни бесконечности легко`,
    announce: `Просто действуйте. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Этот смартфон — настоящая находка.`,
    full_text: `Так ли это на самом деле? Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Просто действуйте. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    picture: `skyscraper`,
    created_date: `2020-03-10`,
    author_id: 3,
  },
];

const comments = [
  {
    text: `Это где ж такие красоты? Совсем немного... Согласен с автором!`,
    created_date: `2019-01-01`,
    author_id: 1,
    article_id: 1,
  },
  {
    text: `Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль.`,
    created_date: `2019-08-12`,
    author_id: 2,
    article_id: 2,
  },
  {
    text: `Ноутбуки победили.`,
    created_date: `2020-03-11`,
    author_id: 3,
    article_id: 3,
  },
  {
    text: `Это прочная древесина.`,
    created_date: `2019-01-02`,
    author_id: 2,
    article_id: 1,
  },
  {
    text: `Хочу такую же футболку :-)`,
    created_date: `2019-09-15`,
    author_id: 1,
    article_id: 2,
  },
  {
    text: `Плюсую, но слишком много буквы!`,
    created_date: `2019-10-06`,
    author_id: 2,
    article_id: 2,
  },
];

const categories = [
  {name: `Программирование`},
  {name: `Кино`},
  {name: `IT`},
  {name: `Железо`},
  {name: `Музыка`},
  {name: `Деревья`},
  {name: `Разное`},
  {name: `Без рамки`},
];

const article_category = [
  {
    article_id: 1,
    category_id: 2,
  },
  {
    article_id: 1,
    category_id: 3,
  },
  {
    article_id: 1,
    category_id: 7,
  },
  {
    article_id: 2,
    category_id: 1,
  },
  {
    article_id: 2,
    category_id: 8,
  },
  {
    article_id: 3,
    category_id: 7,
  },
  {
    article_id: 3,
    category_id: 6,
  },
  {
    article_id: 3,
    category_id: 4,
  },
];

module.exports = {
  avatars,
  authors,
  auths,
  articles,
  comments,
  categories,
  article_category,
};
