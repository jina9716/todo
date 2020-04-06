const _ = require('lodash');
const moment = require('moment');
const Todo = require('../../models/todo');
const {STATUS, CONTEXT} = require('../../constant/const');

exports.getToDoList = async (body) => {
    let {title, status, context, page=1} = body;
    let [startDueDate, endDueDate] = dateValidationCheck(body.startDueDate, body.endDueDate);
    let [startDoneAt, endDoneAt] = dateValidationCheck(body.startDoneAt, body.endDoneAt);
    let [startCreatedAt, endCreatedAt] = dateValidationCheck(body.startCreatedAt, body.endCreatedAt);

    page = Number(page);
    if (!Number.isInteger(page)) {
        throw new Error("page 값이 올바르지 않습니다.");
    }

    let data = {};
    if (title) {
        const str = title.replace(/[?*^$\\]/g, (match)=>{return `\\${match}`}); // 특수문자 역슬래시 replace
        data.title = new RegExp(str);
    }
    if (_.includes([STATUS.TODO, STATUS.IN_PROGRESS, STATUS.DONE], status)) {
        data.status = status;
    }
    if (_.includes([CONTEXT.NONE, CONTEXT.WORK, CONTEXT.HOME], context)) {
        data.context = context;
    }

    data = setDataDate(data, 'dueDate', startDueDate, endDueDate);
    data = setDataDate(data, 'doneAt', startDoneAt, endDoneAt);
    data = setDataDate(data, 'createdAt', startCreatedAt, endCreatedAt);

    const totalCount = await Todo.countDocuments(data);
    const list = await Todo.find(data, null, {skip: (page-1)*10, limit: 10});

    return {items: list, totalCount: totalCount};
};

/**
 * 시작일/종료일 validation check
 * @param startDate
 * @param endDate
 * @returns {[*|moment.Moment|boolean, *]}
 */
dateValidationCheck = (startDate, endDate) => {
    if (startDate !== undefined && startDate !== '' && !moment(new Date(startDate)).isValid()) {
        throw new Error('날짜 형식이 맞지 않습니다.');
    }
    if (endDate !== undefined && endDate !== '' && !moment(new Date(endDate)).isValid()) {
        throw new Error('날짜 형식이 맞지 않습니다.');
    }

    startDate = moment(new Date(startDate)).isValid() && moment(new Date(startDate), 'YYYY-MM-DD');
    endDate = moment(new Date(endDate)).isValid() && moment(new Date(endDate), 'YYYY-MM-DD');

    if (startDate && endDate && endDate.diff(startDate) < 0) {
        throw new Error("조회 종료일은 조회 시작일보다 빠를 수 없습니다.");
    }
    return [startDate, endDate];
};

/**
 * set Data
 * @param data
 * @param field
 * @param startDate
 * @param endDate
 * @returns {*}
 */
setDataDate = (data, field, startDate, endDate) => {
    if (startDate || endDate) {
        data[field] = {};
    }
    if (startDate) {
        data[field].$gte = startDate;
    }
    if (endDate) {
        data[field].$lt = endDate.add(1, 'd');
    }
    return data;
};

