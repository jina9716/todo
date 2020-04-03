const co = require('co');
const createService = require('../services/todo/createService');
const getListService = require('../services/todo/getListService');
const getService = require('../services/todo/getService');
const updateService = require('../services/todo/updateService');
const deleteService = require('../services/todo/deleteService');

exports.createToDo = (req, res) => {
    createService.createToDo(req.body)
    .then(()=>{
        return res.status(204).send();
    })
    .catch(error=>{
        return res.status(400).send(error.stack);
    });
};

exports.createToDo_co = (req, res) => {
    co(function* (){
        try {
            yield createService.createToDo(req.body);
            return res.status(204).send();
        } catch (error) {
            return res.status(400).send(error.stack);
        }
    });
};

exports.createToDo_async = async (req, res) => {
    try {
        await createService.createToDo(req.body);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).send(error.stack);
    }
};

exports.getToDoList = async (req, res)=>{
    try {
        let result = await getListService.getToDoList(req.query);
        return res.send(result);
    } catch (error) {
        return res.status(400).send(error.stack);
    }
};

exports.getToDo = async (req, res) => {
    try {
        let result = await getService.getToDo(req.params.todoId);
        return res.send(result);
    } catch (error) {
        return res.status(400).send(error.stack);
    }
};

exports.updateToDo = async (req, res) => {
    try {
        await updateService.updateToDo(req.params.todoId, req.body);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).send(error.stack);
    }
};

exports.deleteToDo = async (req, res) => {
    try {
        await deleteService.deleteToDo(req.params.todoId);
        return res.status(204).send();
    } catch (error) {
        return res.status(400).send(error.stack);
    }
};