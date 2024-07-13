
# Multilang Backend

## Overview

Multilang Backend is a Node.js application designed to handle multi-language projects. It includes various modules to manage languages, projects, translations, and URLs. The application uses Express.js for routing and includes several middleware functions for authentication, error handling, and rate limiting.

`Warning: I have included my local .env file for testing purposes. Do not push your .env file to the repository. Make sure to add .env to your .gitignore`

Test Data: I have also included a dump.sql file for test data insertion. Use this file to populate your database with test data.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

## Prerequisites

- Node: 20.15.1
- Package Manager: npm 10.8.0

Used command: 
   ```bash
   npm init
   ```
Used OS for development: Windows

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GalaaJS/multilang-backend.git
   cd multilang-backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory and configure your environment variables as needed. Example:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASS=root
   DB_NAME=multilang
   ```

## Usage

1. Start the development server:
   ```bash
   npm start
   ```

2. The server will start on the port specified in your `.env` file (default is 3000).

## Project Structure

```
multilang-backend/
├── .env
├── package.json
├── package-lock.json
├── src/
│   ├── app.js
│   ├── app/
│   │   ├── index.js
│   │   ├── admin/
│   │   │   ├── language/
│   │   │   │   ├── controller.js
│   │   │   │   └── router.js
│   │   │   ├── project/
│   │   │   │   ├── controller.js
│   │   │   │   └── router.js
│   │   │   ├── translation/
│   │   │   │   ├── controller.js
│   │   │   │   └── router.js
│   │   │   ├── url/
│   │   │   │   ├── controller.js
│   │   │   │   └── router.js
│   │   ├── main/
│   │   │   ├── controller.js
│   │   │   └── router.js
│   ├── database/
│   │   ├── db.js
│   │   └── models.js
│   ├── middleware/
│   │   ├── checkAuth.js
│   │   ├── customResponse.js
│   │   ├── error.js
│   │   └── rateLimiterRedis.js
│   ├── utilities/
│   │   └── logger.js
└── .vscode/
    ├── launch.json
    └── settings.json
```

## API Endpoints

### Language Management
- **GET** `/admin/language` - Get all languages
- **POST** `/admin/language` - Add a new language
- **PUT** `/admin/language/:id` - Update a language
- **DELETE** `/admin/language/:id` - Delete a language

### Project Management
- **GET** `/admin/project` - Get all projects
- **POST** `/admin/project` - Add a new project
- **PUT** `/admin/project/:id` - Update a project
- **DELETE** `/admin/project/:id` - Delete a project

### Translation Management
- **GET** `/admin/translation` - Get all translations
- **POST** `/admin/translation` - Add a new translation
- **PUT** `/admin/translation/:id` - Update a translation
- **DELETE** `/admin/translation/:id` - Delete a translation

### URL Management
- **GET** `/admin/url` - Get all URLs
- **POST** `/admin/url` - Add a new URL
- **PUT** `/admin/url/:id` - Update a URL
- **DELETE** `/admin/url/:id` - Delete a URL

### Translation API Endpoint
- **GET** `/translations?project_id=1&lang_code=en&url=/home` - Get translation for website