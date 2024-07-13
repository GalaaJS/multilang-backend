const controller = require('./controller');
const express = require('express');
const router = express.Router();

/**
 * @apiGroup        admin
 * @api             {get} /translation translation list
 * @apiVersion      1.0.0
 * @apiName         translation list
 * @apiDescription  List of translation
 */
router.get('/', controller.select);

/**
 * @apiGroup        admin
 * @api             {post} /translation translation insert
 * @apiVersion      1.0.0
 * @apiName         translation insert
 * @apiDescription  translation insert
 * @apiParam        {String} 	    translation_name 				translation name
 */
router.post('/', controller.insert);

/**
 * @apiGroup        admin
 * @api             {put} /translation/:id translation update
 * @apiVersion      1.0.0
 * @apiName         translation update
 * @apiDescription  translation update
 * @apiParam        {String} 	    translation_name 				translation name
 */
router.put('/:id', controller.update);

/**
 * @apiGroup        admin
 * @api             {delete} /translation/:id translation delete
 * @apiVersion      1.0.0
 * @apiName         translation delete
 * @apiDescription  translation delete
 * @apiParam        {Number} id translation ID
 */
router.delete('/:id', controller.delete);

/**
 * @apiGroup        admin
 * @api             {get} /translation/:id translation detail
 * @apiVersion      1.0.0
 * @apiName         translation detail
 * @apiDescription  translation detail
 * @apiParam        {Number} id translation ID
 */
router.get('/:id', controller.detail);

module.exports = router;
