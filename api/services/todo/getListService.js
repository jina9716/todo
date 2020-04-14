const _ = require('lodash');
const moment = require('moment');
const Todo = require('../../models/todo');
const validator = require('../../utils/validator');

const getDateFilter = (startDate, endDate, field) => {
    let obj = {};
    if (startDate) {
        _.set(obj, `${field}.$gte`, startDate);
    }
    if (endDate) {
        _.set(obj, `${field}.$lt`, moment(endDate).add(1, 'd').format('YYYY-MM-DD'));
    }
    return obj;
};

const getFilter = (data) => {
    let filter = {};

    if (data.title) filter.title = new RegExp(_.escapeRegExp(data.title));
    if (data.status) filter.status = data.status;
    if (data.context) filter.context = data.context;

    _.assign(
        filter,
        getDateFilter(data.startDueDate, data.endDueDate, 'dueDate'),
        getDateFilter(data.startDoneAt, data.endDoneAt, 'doneAt'),
        getDateFilter(data.startCreatedAt, data.endCreatedAt, 'createdAt')
    );

    return filter;
};

exports.getToDoList = async (data) => {
    // validation check
    validator.validateList(data);

    // 쿼리 필터 가져오기
    const filter = getFilter(data);

    const countDocuments = Todo.countDocuments(filter);
    const find = Todo.find(filter, null, { skip: (Number(data.page) - 1) * 10, limit: 10 });

    return Promise.all([find, countDocuments]).then(([items, totalCount]) => ({ items, totalCount }));
};
