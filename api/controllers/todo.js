'use strict';

const co = require('co');
const service = require('../services/todo');

exports.createToDo = function(req, res){
    service.createToDo(req.body)
    .then(()=>{
        return res.status(204).send();
    })
    .catch(error=>{
        return res.status(400).send(error);
    });
};

exports.createToDo_co = function(req, res){
    co(function* (){
        try {
            yield service.createToDo(req.body);
            return res.status(204).send();
        } catch (error) {
            return res.status(400).send(error);
        }
    });
};

exports.createToDo_async = async function(req, res){
    try {
        await service.createToDo(req.body);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).send(error);   
    }
};

exports.getToDoList = async function(req, res){
    try {
        let result = await service.getToDoList(req.query);
        return res.send(result);
    } catch (error) {
        return res.status(400).send(error);
    }
};

exports.getToDo = async function(req, res){
    try {
        let result = await service.getToDo(req.params.todoId);
        return res.send(result);
    } catch (error) {
        return res.status(400).send(error);
    }
};

exports.updateToDo = async function(req, res){
    try {
        await service.updateToDo(req.params.todoId, req.body);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).send(error);
    }
};

exports.deleteToDo = async function(req, res){
    try {
        await service.deleteToDo(req.params.todoId);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).send(error);
    }
};