const moment = require('moment');
const mongoose = require('../conf/db');
const {STATUS, CONTEXT} = require('../constant/const');

const todoSchema = mongoose.Schema({
    title: {type: String, required: true},
    status: {type: String, required: true, default: 'TODO', enum: [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.DONE]},
    context: {type: String, required: true, default: 'NONE', enum: [CONTEXT.NONE, CONTEXT.WORK, CONTEXT.HOME]},
    dueDate: {type: Date, required: false},
    createdAt: {type: Date, required: true, default: moment()},
    doneAt: {type: Date, required: false}
}, {collection: 'todo'});

todoSchema.statics.isValidId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId);
};

module.exports = mongoose.conn.model('Todo', todoSchema);