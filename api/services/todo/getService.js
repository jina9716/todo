const Todo = require('../../models/todo');
const validator = require('../../utils/validator');

exports.getToDo = async (todoId) => {
    validator.validateId(todoId); // validation check
    return Todo.findOne({ _id: todoId });
};
