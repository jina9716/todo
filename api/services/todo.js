'use strict';

const co = require('co');

const Todo = require('../models/todo');

exports.createToDo = async function(req, res){
    try {
        const result = await Todo.create(req.body);
        console.log(result);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).send(error);
    }
};

exports.getToDoList = async function(req, res){
    try {
        const title = req.query.title;
        const status = req.query.status;
        const context = req.query.context;
        const startDueDate = req.query.startDueDate;
        const endDueDate = req.query.endDueDate;
        const startDoneAt = req.query.startDoneAt;
        const endDoneAt = req.query.endDoneAt ;
        const startCreatedAt = req.query.startCreatedAt;
        const endCreatedAt = req.query.endCreatedAt;

        if (new Date(startDueDate) > new Date(endDueDate) || new Date(startDoneAt) > new Date(endDoneAt) || new Date(startCreatedAt) > new Date(endCreatedAt)) {
            throw "조회 종료일은 조회 시작일보다 빠를 수 없습니다.";
        }
    
        let query = Todo.find().where('title').regex(new RegExp(title));
    
        if (['TODO', 'IN_PROGRESS', 'DONE'].indexOf(status) !== -1) {
            query.where('status').equals(status);
        }
        if (['NONE', 'WORK', 'HOME'].indexOf(context) !== -1) {
            query.where('context').equals(context);
        }
        if (startDueDate != "") {
            query.where('dueDate').gte(new Date(startDueDate));
        }
        if (endDueDate != "") {
            query.where('dueDate').lte(new Date(endDueDate));
        }
        if (startDoneAt != "") {
            query.where('doneAt').gte(new Date(startDoneAt));
        }
        if (endDoneAt != "") {
            query.where('doneAt').lte(new Date(endDoneAt).setDate(new Date(endDoneAt).getDate()+1));
        }
        if (startCreatedAt != "") {
            query.where('createdAt').gte(new Date(startCreatedAt));
        }
        if (endCreatedAt != "") {
            query.where('createdAt').lt(new Date(endCreatedAt).setDate(new Date(endCreatedAt).getDate()+1));
        }
    
        let list = await query.select('title status context dueDate createdAt doneAt -_id').limit(10);
        let totalCount = await query.countDocuments();

        let result = {items: list, totalCount: totalCount};
        return res.send(result);
    } catch (error) {
        return res.status(400).send(error);
    }
};

exports.getToDo = async function(req, res){
    try {
        const result = await Todo.findOne({_id: req.params.todoId}).select('title status context dueDate createdAt doneAt -_id');
        return res.send(result);
    } catch (error) {
        return res.status(400).send(error);
    }
};

exports.updateToDo = async function(req, res){
    try {
        let data = req.body;
        if (data.status == "DONE") {
            data.doneAt = new Date();
        }
        const result = await Todo.updateOne({_id: req.params.todoId}, data, {runValidators: true});
        console.log(result);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).send(error);
    }
};

exports.deleteToDo = async function(req, res){
    try {
        const result = await Todo.deleteOne({_id: req.params.todoId});
        console.log(result);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).send(error);
    }
};

/**
 * 아래 함수는 async/await 말고 co로 작성
 */
exports.createToDo_co = function(req, res){
    co(function* (){
        return yield Todo.create(req.body);
    }).then(result => {
        console.log(result);
        return res.status(204).send();
    }).catch(error => {
        return res.status(400).send(error);
    });
};

exports.getToDoList_co = function(req, res){
    const title = req.query.title;
    const status = req.query.status;
    const context = req.query.context;
    const startDueDate = req.query.startDueDate;
    const endDueDate = req.query.endDueDate;
    const startDoneAt = req.query.startDoneAt;
    const endDoneAt = req.query.endDoneAt ;
    const startCreatedAt = req.query.startCreatedAt;
    const endCreatedAt = req.query.endCreatedAt;

    if (new Date(startDueDate) > new Date(endDueDate) || new Date(startDoneAt) > new Date(endDoneAt) || new Date(startCreatedAt) > new Date(endCreatedAt)) {
        return res.status(400).send("조회 종료일은 조회 시작일보다 빠를 수 없습니다.");
    }

    co(function* (){
        let query = Todo.find().where('title').regex(new RegExp(title));

        if (['TODO', 'IN_PROGRESS', 'DONE'].indexOf(status) !== -1) {
            query.where('status').equals(status);
        }
        if (['NONE', 'WORK', 'HOME'].indexOf(context) !== -1) {
            query.where('context').equals(context);
        }
        if (startDueDate != "") {
            query.where('dueDate').gte(new Date(startDueDate));
        }
        if (endDueDate != "") {
            query.where('dueDate').lte(new Date(endDueDate));
        }
        if (startDoneAt != "") {
            query.where('doneAt').gte(new Date(startDoneAt));
        }
        if (endDoneAt != "") {
            query.where('doneAt').lte(new Date(endDoneAt).setDate(new Date(endDoneAt).getDate()+1));
        }
        if (startCreatedAt != "") {
            query.where('createdAt').gte(new Date(startCreatedAt));
        }
        if (endCreatedAt != "") {
            query.where('createdAt').lt(new Date(endCreatedAt).setDate(new Date(endCreatedAt).getDate()+1));
        }

        let list = yield query.select('title status context dueDate createdAt doneAt -_id').limit(10);
        let totalCount = yield query.countDocuments();
        let result = {items: list, totalCount: totalCount};
        return result;
    }).then(result => {
        return res.send(result);
    }).catch(error => {
        return res.status(400).send(error);
    });
};