const _ = require('lodash');
const Todo = require('../../models/todo');
const {STATUS, CONTEXT} = require('../../constant/const');

exports.createToDo = async (data) => {
    if (data.title === undefined) {
        throw new Error("title is required.");
    }
    if (data.status !== undefined && !_.includes([STATUS.TODO, STATUS.IN_PROGRESS, STATUS.DONE], data.status)) {
        throw new Error("invalid status");
    }
    if (data.context !== undefined && !_.includes([CONTEXT.NONE, CONTEXT.WORK, CONTEXT.HOME], data.context)) {
        throw new Error("invalid context");
    }
    return Todo.create(data);
};