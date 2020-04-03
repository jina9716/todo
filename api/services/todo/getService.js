const Todo = require('../../models/todo');

exports.getToDo = async (todoId) => {
    if (!Todo.isValidId(todoId)) {
        throw new Error('invalid id');
    }
    return Todo.findOne({_id: todoId});
};