const controller = require('./controller');
const express = require('express');
const router = express.Router();

/**
 * @apiGroup        admin
 * @api             {get} /project project list
 * @apiVersion      1.0.0
 * @apiName         project list
 * @apiDescription  List of project
 */
router.get('/', controller.select);

/**
 * @apiGroup        admin
 * @api             {post} /project project insert
 * @apiVersion      1.0.0
 * @apiName         project insert
 * @apiDescription  project insert
 * @apiParam        {String} 	    project_name 				project name
 */
router.post('/', controller.insert);

/**
 * @apiGroup        admin
 * @api             {put} /project/:id project update
 * @apiVersion      1.0.0
 * @apiName         project update
 * @apiDescription  project update
 * @apiParam        {String} 	    project_name 				project name
 */
router.put('/:id', controller.update);

/**
 * @apiGroup        admin
 * @api             {delete} /project/:id project delete
 * @apiVersion      1.0.0
 * @apiName         project delete
 * @apiDescription  project delete
 * @apiParam        {Number} id project ID
 */
router.delete('/:id', controller.delete);

/**
 * @apiGroup        admin
 * @api             {get} /project/:id project detail
 * @apiVersion      1.0.0
 * @apiName         project detail
 * @apiDescription  project detail
 * @apiParam        {Number} id project ID
 */
router.get('/:id', controller.detail);

module.exports = router;
