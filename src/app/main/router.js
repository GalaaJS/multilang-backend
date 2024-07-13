const controller = require('./controller');
const express = require('express');
const router = express.Router();

/**
 * @api {get} /translations Get Translations
 * @apiName GetTranslations
 * @apiGroup Translations
 *
 * @apiParam {Number} project_id Project ID.
 * @apiParam {String} lang_code Language code.
 * @apiParam {String} [url] URL.
 *
 * @apiSuccess {String} status Status of the request (success or error).
 * @apiSuccess {Object[]} data List of translation strings.
 * @apiSuccess {String} data.key Key of the translation string.
 * @apiSuccess {String} data.value Value of the translation string.
 *
 * @apiError {String} status Status of the request (error).
 * @apiError {String} message Error message.
 */
router.get('/', controller.select);

module.exports = router;
