'use strict';

const express = require(`express`);
const {Router} = require(`express`);

const {HttpCode} = require(`./../cli/constants.js`);
const {Empty} = require(`./constants.js`);
const {getLogger} = require(`./../logger.js`);

const {getFreshComments, getCommentsByUserId} = require(`./utils/comments.js`);

const logger = getLogger();

const commentsRouter = new Router();

commentsRouter.use(express.json());

commentsRouter.get(`/fresh`, async (req, res) => {
  try {
    const data = await getFreshComments();

    if (!data || data.length === 0) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.COMMENTS);
    } else {
      res.json(data);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.COMMENTS);
    logger.error(`Error occurs: ${error}`);
  }
});

commentsRouter.get(`/byUser/:id`, async (req, res) => {
  try {
    const data = await getCommentsByUserId(req.params.id);

    if (!data || data.length === 0) {
      res.status(HttpCode.BAD_REQUEST).json(Empty.COMMENTS);
    } else {
      res.json(data);
    }
    logger.debug(`${req.method} ${req.originalUrl} --> res status code ${res.statusCode}`);

  } catch (error) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json(Empty.COMMENTS);
    logger.error(`Error occurs: ${error}`);
  }
});


module.exports = commentsRouter;
