const express = require('express');
const adminRouter = express.Router();
const mainRouter = express.Router();

// const auth = require('./../middleware/checkAuth');

// admin
const adminProjectRouter = require('./admin/project/router');
const adminLanguageRouter = require('./admin/language/router');
const adminTranslationRouter = require('./admin/translation/router');
const adminUrlRouter = require('./admin/url/router');

// main
const main = require('./main/router');

// admin route
adminRouter.use('/project', adminProjectRouter);
adminRouter.use('/language', adminLanguageRouter);
adminRouter.use('/translation', adminTranslationRouter);
adminRouter.use('/url', adminUrlRouter);

// main
mainRouter.use('/translations', main);

module.exports = (app) => {
  // app.use('/admin', auth.isAuthenticated, [adminRouter]);
  app.use('/admin', [adminRouter]);
  app.use('/', [mainRouter]);
};
