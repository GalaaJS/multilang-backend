import compression from 'compression';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';

import { AppDataSource } from './data-source';

import { isAuthenticated } from './middleware/authMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';

import authRoutes from './routes/auth.route';
import projectRoutes from './routes/project.route';
import translationRoutes from './routes/translation.route';
import urlRoutes from './routes/url.route';
import userRoutes from './routes/user.route';

import { DataController } from './controllers/data.controller';
import { UserController } from './controllers/user.controller';
import logger from './utils/logger';

dotenv.config();

// PORT
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
// get access_token from cookies
app.use(cookieParser());
// performance
// app.use(compression());
app.use(
  compression({
    level: 6, // Compression level (0-9), 6 is a good balance of speed and compression
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
      // Compress only certain types of content
      if (req.headers['x-no-compression']) {
        return false; // Don't compress responses if this request header is present
      }
      return compression.filter(req, res);
    },
  })
);

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', isAuthenticated, userRoutes);
app.use('/api/projects', isAuthenticated, projectRoutes);
app.use('/api/urls', isAuthenticated, urlRoutes);
app.use('/api/translations', isAuthenticated, translationRoutes);

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.get('/api/checkSession', isAuthenticated, UserController.checkSession);
app.get('/api/data', DataController.getAll);

app.use(errorMiddleware);

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Started application. App listening on port ${port}!`);
    });
  })
  .catch((err) => {
    logger.error('Error during Data Source initialization:', err);
  });

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

declare module 'express-serve-static-core' {
  interface Request {
    currentUserId?: number;
  }
}
