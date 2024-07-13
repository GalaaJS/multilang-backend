const controller = require('./controller');
const express = require('express');
const router = express.Router();

/**
 * @apiGroup        admin
 * @api             {get} /language language list
 * @apiVersion      1.0.0
 * @apiName         language list
 * @apiDescription  List of language
 */
router.get('/', controller.select);

/**
 * @apiGroup        admin
 * @api             {post} /language language insert
 * @apiVersion      1.0.0
 * @apiName         language insert
 * @apiDescription  Language insert
 * @apiParam        {String} 	    language_name 				language name
 */
router.post('/', controller.insert);

/**
 * @apiGroup        admin
 * @api             {put} /language/:id language update
 * @apiVersion      1.0.0
 * @apiName         language update
 * @apiDescription  language update
 * @apiParam        {String} 	    language_name 				language name
 */
router.put('/:id', controller.update);

/**
 * @apiGroup        admin
 * @api             {delete} /language/:id language delete
 * @apiVersion      1.0.0
 * @apiName         language delete
 * @apiDescription  language delete
 * @apiParam        {Number} id language ID
 */
router.delete('/:id', controller.delete);

/**
 * @apiGroup        admin
 * @api             {get} /language/:id language detail
 * @apiVersion      1.0.0
 * @apiName         language detail
 * @apiDescription  language detail
 * @apiParam        {Number} id language ID
 */
router.get('/:id', controller.detail);

module.exports = router;
