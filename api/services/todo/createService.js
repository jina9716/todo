const Todo = require('../../models/todo');
const validator = require('../../utils/validator');

exports.createToDo = async (data) => {
    validator.validateCreate(data); // validation check
    return Todo.create(data);
};
