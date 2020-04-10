const Todo = require('../../models/todo');
const validator = require('../../utils/validator');

exports.getToDo = async (todoId) => {
    validator.validateGet(todoId); // validation check
    return Todo.findOne({ _id: todoId });
};
