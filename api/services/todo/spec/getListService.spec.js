const sinon = require('sinon');
const should = require('should');
const mongoose = require('mongoose');
require('sinon-mongoose');

describe('TODO 목록 조회 테스트', ()=>{
    let Todo;
    let getListService;
    let sandbox;

    before(() => {
        mongoose.on = () => {};
        mongoose.createConnection = () => mongoose;

        Todo = require('../../../models/todo');
        getListService = require('../getListService');

        sandbox = sinon.createSandbox();
        sandbox.stub(Todo, 'find');
        sandbox.stub(Todo, 'countDocuments');
    });
    after(() => {
        sandbox.restore();
    });
    it('종료일이 시작일 보다 빠르면 에러를 반환한다', async () => {
        let data = {
            startDueDate: '2021-03-20',
            endDueDate: '2020-03-21'
        };
        await getListService.getToDoList(data).should.rejectedWith("조회 종료일은 조회 시작일보다 빠를 수 없습니다.");
        Todo.find.called.should.not.ok();
        data = {
            startDoneAt: '2021-03-20',
            endDoneAt: '2020-03-21'
        };
        await getListService.getToDoList(data).should.rejectedWith("조회 종료일은 조회 시작일보다 빠를 수 없습니다.");
        Todo.find.called.should.not.ok();
        data = {
            startCreatedAt: '2021-03-20',
            endCreatedAt: '2020-03-21'
        };
        await getListService.getToDoList(data).should.rejectedWith("조회 종료일은 조회 시작일보다 빠를 수 없습니다.");
        Todo.find.called.should.not.ok();
    });
    it('page 값이 올바르지 않으면 에러를 반환한다', async () =>{
        let data = {
            page: "2s"
        };
        await getListService.getToDoList(data).should.rejectedWith("page 값이 올바르지 않습니다.");
        Todo.find.called.should.not.ok();
    });
    it('날짜 형식이 맞지 않으면 에러를 반환한다', async () => {
        let data = {
            startCreatedAt: '2020-03-25s',
            endCreatedAt: '2020-03-30',
        };

        await getListService.getToDoList(data).should.rejectedWith('날짜 형식이 맞지 않습니다.');
        Todo.find.called.should.not.ok();
    });
    it('정상 작동 시 find 결과 확인', async () => {
        let data = {
            title: "딸기",
            startDueDate: '2020-03-24',
            endDueDate: '2020-03-30',
            startDoneAt: '',
            endDoneAt: '',
            startCreatedAt: '2020-03-24',
            endCreatedAt: '2020-03-30',
            page:"1"
        };
        await getListService.getToDoList(data);
        Todo.countDocuments.called.should.ok();
        Todo.find.called.should.ok();
    });
});