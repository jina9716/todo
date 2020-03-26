'use strict';

const service = require('../services/todo');

exports.createToDo = function(req, res){
    return service.createToDo(req, res);
};

exports.getToDoList = function(req, res){
    return service.getToDoList(req, res);
};

exports.getToDo = function(req, res){
    return service.getToDo(req, res);
};

exports.updateToDo = function(req, res){
    return service.updateToDo(req, res);
};

exports.deleteToDo = function(req, res){
    return service.deleteToDo(req, res);
};