const Todo = require('../../models/todo');
const validator = require('../../utils/validator');

exports.deleteToDo = async (todoId) => {
    validator.validateDelete(todoId); // validation check
    return Todo.deleteOne({ _id: todoId });
};
