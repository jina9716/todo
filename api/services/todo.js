'use strict';

const Todo = require('../models/todo');

exports.createToDo = function(data){
    return Todo.create(data);
};

exports.getToDoList = async function(params){
    const {title, status, context, startDueDate, endDueDate, startDoneAt, endDoneAt, startCreatedAt, endCreatedAt, page} = params;

    if (new Date(startDueDate) > new Date(endDueDate) || new Date(startDoneAt) > new Date(endDoneAt) || new Date(startCreatedAt) > new Date(endCreatedAt)) {
        throw "조회 종료일은 조회 시작일보다 빠를 수 없습니다.";
    }

    let query = Todo.where('title').regex(new RegExp(title));

    if (['TODO', 'IN_PROGRESS', 'DONE'].indexOf(status) !== -1) {
        query.where('status').equals(status);
    }
    if (['NONE', 'WORK', 'HOME'].indexOf(context) !== -1) {
        query.where('context').equals(context);
    }
    if (startDueDate != "" && startDueDate != undefined) {
        query.where('dueDate').gte(new Date(startDueDate));
    }
    if (endDueDate != "" && endDueDate != undefined) {
        query.where('dueDate').lte(new Date(endDueDate));
    }
    if (startDoneAt != "" && startDoneAt != undefined) {
        query.where('doneAt').gte(new Date(startDoneAt));
    }
    if (endDoneAt != "" && endDoneAt != undefined) {
        query.where('doneAt').lte(new Date(endDoneAt).setDate(new Date(endDoneAt).getDate()+1));
    }
    if (startCreatedAt != "" && startCreatedAt != undefined) {
        query.where('createdAt').gte(new Date(startCreatedAt));
    }
    if (endCreatedAt != "" && endCreatedAt != undefined) {
        query.where('createdAt').lt(new Date(endCreatedAt).setDate(new Date(endCreatedAt).getDate()+1));
    }

    const totalCount = await query.countDocuments();
    const list = await query.find().skip((Number(page)-1)*10).limit(10).exec();

    const result = {items: list, totalCount: totalCount};
    return result;
};

exports.getToDo = function(todoId){
    return Todo.findById(todoId).exec();
};

exports.updateToDo = function(todoId, data){
    if (data.status == "DONE") {
        data.doneAt = new Date();
    }
    return Todo.updateOne({_id: todoId}, data, {runValidators: true}).exec();
};

exports.deleteToDo = function(todoId){
    return Todo.deleteOne({_id: todoId}).exec();
};