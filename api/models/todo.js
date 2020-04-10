const mongoose = require('mongoose');
const _ = require('lodash');
const db = require('../conf/db');
const { STATUS, CONTEXT } = require('../constant/todo');

const todoSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        status: { type: String, required: true, default: STATUS.TODO, enum: _.values(STATUS) },
        context: { type: String, required: true, default: CONTEXT.NONE, enum: _.values(CONTEXT) },
        dueDate: { type: Date, required: false },
        doneAt: { type: Date, required: false },
    },
    { timestamps: { createdAt: true } }
);

module.exports = db.getConnection().model('Todo', todoSchema);
