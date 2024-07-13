const controller = require('./controller');
const express = require('express');
const router = express.Router();

/**
 * @apiGroup        admin
 * @api             {get} /url url list
 * @apiVersion      1.0.0
 * @apiName         url list
 * @apiDescription  List of url
 */
router.get('/', controller.select);

/**
 * @apiGroup        admin
 * @api             {post} /url url insert
 * @apiVersion      1.0.0
 * @apiName         url insert
 * @apiDescription  url insert
 * @apiParam        {String} 	    url_name 				url name
 */
router.post('/', controller.insert);

/**
 * @apiGroup        admin
 * @api             {put} /url/:id url update
 * @apiVersion      1.0.0
 * @apiName         url update
 * @apiDescription  url update
 * @apiParam        {String} 	    url_name 				url name
 */
router.put('/:id', controller.update);

/**
 * @apiGroup        admin
 * @api             {delete} /url/:id url delete
 * @apiVersion      1.0.0
 * @apiName         url delete
 * @apiDescription  url delete
 * @apiParam        {Number} id url ID
 */
router.delete('/:id', controller.delete);

/**
 * @apiGroup        admin
 * @api             {get} /url/:id url detail
 * @apiVersion      1.0.0
 * @apiName         url detail
 * @apiDescription  url detail
 * @apiParam        {Number} id url ID
 */
router.get('/:id', controller.detail);

module.exports = router;
