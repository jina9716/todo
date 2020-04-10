const sinon = require('sinon');
const mongoose = require('mongoose');
require('should');
require('sinon-mongoose');

describe('TODO 생성 테스트', () => {
    let Todo;
    let createService;
    let sandbox;

    before(() => {
        mongoose.on = () => {};
        mongoose.createConnection = () => mongoose;

        Todo = require('../../../models/todo');
        createService = require('../createService');

        sandbox = sinon.createSandbox();
        sandbox.stub(Todo, 'create');
    });
    after(() => {
        sandbox.restore();
    });
    it('할 일 제목이 없으면 에러를 반환한다', async () => {
        const data = {
            status: 'DONE',
        };
        await createService.createToDo(data).should.rejectedWith('title 은 필수값 입니다.');
        Todo.create.called.should.not.ok();
    });
    it('할 일 상태가 없으면 에러를 반환한다', async () => {
        const data = {
            title: 'title',
        };
        await createService.createToDo(data).should.rejectedWith('status 는 필수값 입니다.');
        Todo.create.called.should.not.ok();
    });
    it('할 일 컨텍스트가 없으면 에러를 반환한다', async () => {
        const data = {
            title: 'title',
            status: 'DONE',
        };
        await createService.createToDo(data).should.rejectedWith('context 는 필수값 입니다.');
        Todo.create.called.should.not.ok();
    });
    it('할 일의 상태가 TODO/IN_PROGRESS/DONE이 아니면 에러를 반환한다', async () => {
        const data = {
            title: 'title',
            status: 'DONE#',
            context: 'WORK',
        };
        await createService.createToDo(data).should.rejectedWith('status 값이 맞지 않습니다.');
        Todo.create.called.should.not.ok();
    });
    it('할 일의 컨텍스트가 NONE/WORK/HOME이 아니면 에러를 반환한다', async () => {
        const data = {
            title: 'title',
            status: 'DONE',
            context: 'WORK!',
        };
        await createService.createToDo(data).should.rejectedWith('context 값이 맞지 않습니다.');
        Todo.create.called.should.not.ok();
    });
    it('마감 예정일의 형식이 올바르지 않으면 에러를 반환한다', async () => {
        const data = {
            title: 'title',
            status: 'DONE',
            context: 'WORK',
            dueDate: 'WORK!',
        };
        await createService.createToDo(data).should.rejectedWith('날짜 형식이 맞지 않습니다.');
        Todo.create.called.should.not.ok();
    });
    it('유효성 검사 통과 시 할 일을 생성한다', async () => {
        const data = {
            title: 'test!!!!',
            context: 'HOME',
            status: 'TODO',
        };
        await createService.createToDo(data);
        Todo.create.called.should.ok();
    });
});
