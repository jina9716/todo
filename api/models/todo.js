'use strict';

const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    status: {type: String, required: true, default: 'TODO', enum: ['TODO', 'IN_PROGRESS', 'DONE']},
    context: {type: String, required: true, default: 'NONE', enum: ['NONE', 'WORK', 'HOME']},
    dueDate: {type: Date, required: false},
    createdAt: {type: Date, required: true, default: Date.now},
    doneAt: {type: Date, required: false}
}, {collection: 'todo'});

module.exports = mongoose.model('Todo', todoSchema);