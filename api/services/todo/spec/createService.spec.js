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
    it('title 값이 없으면 에러를 반환한다', async () => {
        const data = {
            status: 'DONE',
        };
        await createService.createToDo(data).should.rejectedWith('title 은 필수값 입니다.');
        Todo.create.called.should.not.ok();
    });
    it('status가 TODO/IN_PROGRESS/DONE이 아니면 에러를 반환한다', async () => {
        const data = {
            title: 'title',
            status: 'DONE#',
        };
        await createService.createToDo(data).should.rejectedWith('status 값이 맞지 않습니다.');
        Todo.create.called.should.not.ok();
    });
    it('context가 NONE/WORK/HOME이 아니면 에러를 반환한다', async () => {
        const data = {
            title: 'title',
            context: 'WORK!',
        };
        await createService.createToDo(data).should.rejectedWith('context 값이 맞지 않습니다.');
        Todo.create.called.should.not.ok();
    });
    it('정상 작동 시 create 호출 하는지 체크', async () => {
        const data = {
            title: 'test!!!!',
            context: 'HOME',
            status: 'TODO',
        };
        await createService.createToDo(data);
        Todo.create.called.should.ok();
    });
});
