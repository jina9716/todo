const Todo = require('../../models/todo');
const { STATUS } = require('../../constant/todo');
const validator = require('../../utils/validator');

exports.updateToDo = async (todoId, data) => {
    // validation check
    validator.validateUpdate(todoId, data);

    // doc
    let doc = { $set: { ...data } };
    if (data.status === STATUS.DONE) {
        doc.$set.doneAt = new Date();
    }
    return Todo.updateOne({ _id: todoId }, doc, { runValidators: true });
};
