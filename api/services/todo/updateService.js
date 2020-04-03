const _ = require('lodash');
const Todo = require('../../models/todo');
const {STATUS, CONTEXT} = require('../../constant/const');

exports.updateToDo = async (todoId, data) => {
    if (!Todo.isValidId(todoId)){
        throw new Error('invalid id');
    }
    if (data.status !== undefined && !_.includes([STATUS.TODO, STATUS.IN_PROGRESS, STATUS.DONE], data.status)) {
        throw new Error("invalid status");
    }
    if (data.context !== undefined && !_.includes([CONTEXT.NONE, CONTEXT.WORK, CONTEXT.HOME], data.context)) {
        throw new Error("invalid context");
    }

    let obj = Object.assign({}, data);
    if (data.status == "DONE") {
        obj.doneAt = new Date();
    }
    return Todo.updateOne({_id: todoId}, obj, {runValidators: true});
};