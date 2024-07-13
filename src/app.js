const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// db models
const {
  Project,
  Language,
  ProjectLanguage,
  Translation,
  Url,
  TranslationUrl,
} = require('./database/models');

// performance
const compression = require('compression');
// security
const helmet = require('helmet');
const rateLimiterMiddleware = require('./middleware/rateLimiterRedis');
// error handling
const { handleError, ErrorHandler } = require('./middleware/error');
// custom response
const customResponse = require('./middleware/customResponse');
// logger
const logger = require('./utilities/logger');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimiterMiddleware);
app.use(helmet());
app.use(compression());
app.use(customResponse);

// Sync database
(async () => {
  await Project.sync();
  await Language.sync();
  await ProjectLanguage.sync();
  await Translation.sync();
  await Url.sync();
  await TranslationUrl.sync();
})();

app.get('/', (req, res, next) => {
  res.send('MultiLang server is working!');
});

app.get('/error', async (req, res) => {
  throw new ErrorHandler(500, 'Internal server error');
});

// import api
require('./app/index')(app);

app.use((req, res) => {
  res.notFound();
});

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(port, () =>
  logger.info(`Started application. App listening on port ${port}!`)
);
