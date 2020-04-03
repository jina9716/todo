const Todo = require('../../models/todo');

exports.deleteToDo = async (todoId) => {
    if (!Todo.isValidId(todoId)){
        throw new Error('invalid id');
    }
    return Todo.deleteOne({_id: todoId});
};