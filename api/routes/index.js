'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/todo');

router.post('/', controller.createToDo);
router.get('/', controller.getToDoList);
router.get('/:todoId', controller.getToDo);
router.put('/:todoId', controller.updateToDo);
router.delete('/:todoId', controller.deleteToDo);

module.exports = router;