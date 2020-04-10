const _ = require('lodash');
const moment = require('moment');
const { STATUS, CONTEXT } = require('../constant/todo');

const validateStatus = (status) => {
    if (!_.isNil(status) && status !== '' && !_.includes(_.keys(STATUS), status)) {
        throw new Error('status 값이 맞지 않습니다.');
    }
};

const validateContext = (context) => {
    if (!_.isNil(context) && context !== '' && !_.includes(_.keys(CONTEXT), context)) {
        throw new Error('context 값이 맞지 않습니다.');
    }
};

const validateDate = (date) => {
    if (!_.isNil(date) && date !== '' && !moment(date, 'YYYY-MM-DD', true).isValid()) {
        throw new Error('날짜 형식이 맞지 않습니다.');
    }
};

exports.validateCreate = (data) => {
    if (_.isNil(data.title)) throw new Error('title 은 필수값 입니다.');
    if (_.isNil(data.status)) throw new Error('status 는 필수값 입니다.');
    if (_.isNil(data.context)) throw new Error('context 는 필수값 입니다.');
    validateStatus(data.status);
    validateContext(data.context);
    validateDate(data.dueDate);
};

const compareDate = (startDate, endDate) => {
    if (moment(endDate, 'YYYY-MM-DD', true).diff(moment(startDate, 'YYYY-MM-DD', true)) < 0) {
        throw new Error('조회 종료일은 조회 시작일보다 빠를 수 없습니다.');
    }
};

exports.validateList = (data) => {
    const {
        status,
        context,
        startDueDate,
        endDueDate,
        startDoneAt,
        endDoneAt,
        startCreatedAt,
        endCreatedAt,
        page,
    } = data;

    validateStatus(status);
    validateContext(context);

    validateDate(startDueDate);
    validateDate(endDueDate);
    validateDate(startDoneAt);
    validateDate(endDoneAt);
    validateDate(startCreatedAt);
    validateDate(endCreatedAt);

    compareDate(startDueDate, endDueDate);
    compareDate(startDoneAt, endDoneAt);
    compareDate(startCreatedAt, endCreatedAt);

    if (!Number.isInteger(Number(page)) || Number(page) < 1) {
        throw new Error('page 값이 올바르지 않습니다.');
    }
};

exports.validateId = (objectId) => {
    if (!/^[a-fA-F0-9]{24}$/.test(objectId)) {
        throw new Error('id 형식이 맞지 않습니다.');
    }
};

exports.validateUpdate = (todoId, data) => {
    this.validateId(todoId);
    validateStatus(data.status);
    validateContext(data.context);
};
