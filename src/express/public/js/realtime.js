'use strict';

const socket = io();

const commentList = document.querySelector(`.last__list`);
const articleList = document.querySelector(`.hot__list`);

const createCommentElem = (comment) => {
  let item = document.createElement(`li`);
  item.classList.add(`last__list-item`);

  let avatarElem = document.createElement(`img`);
  avatarElem.classList.add(`last__list-image`);
  avatarElem.src = `img/${comment.author.avatar.small}`;
  avatarElem.width = `20px`;
  avatarElem.height = `20px`;
  avatarElem.alt = `Аватар пользователя`;

  let authorElem = document.createElement(`b`);
  authorElem.classList.add(`last__list-name`);
  authorElem.innerHTML = `${comment.author.firstname} ${comment.author.lastname}`;

  let textElem = document.createElement(`a`);
  textElem.classList.add(`last__list-link`);
  textElem.href = `/articles/${comment.article.id}`;
  textElem.innerHTML = comment.text;

  item.appendChild(avatarElem);
  item.appendChild(authorElem);
  item.appendChild(textElem);

  return item;
};

const createArticleElem = (article) => {
  const {id, count, announce} = article;

  let item = document.createElement(`li`);
  item.classList.add(`hot__list-item`);

  let announceElem = document.createElement(`a`);
  announceElem.classList.add(`hot__list-link`);
  announceElem.href = `/articles/${id}`;
  announceElem.innerHTML = announce;

  let commentCounterElem = document.createElement(`sub`);
  commentCounterElem.classList.add(`hot__link-sup`);
  commentCounterElem.innerHTML = count;

  announceElem.appendChild(commentCounterElem);
  item.appendChild(announceElem);

  return item;
};

const refreshNode = (node, data, createElem) => {
  node.innerHTML = ``;
  for (let item of data) {
    const elem = createElem(item);
    node.appendChild(elem);
  }
};

if (commentList && articleList) {
  socket.on(`comment:add`, function (data) {
    const {freshComments, hotArticles} = JSON.parse(data);

    refreshNode(commentList, freshComments, createCommentElem);
    refreshNode(articleList, hotArticles, createArticleElem);
  });
}
