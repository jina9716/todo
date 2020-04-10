const sinon = require('sinon');
const mongoose = require('mongoose');
require('should');
require('sinon-mongoose');

describe('TODO 업데이트 테스트', () => {
    let Todo;
    let updateService;
    let sandbox;

    before(() => {
        mongoose.on = () => {};
        mongoose.createConnection = () => mongoose;

        Todo = require('../../../models/todo');
        updateService = require('../updateService');

        sandbox = sinon.createSandbox();
        sandbox.stub(Todo, 'updateOne');
    });
    after(() => {
        sandbox.restore();
    });
    it('id가 올바르지 않으면 에러를 반환한다', async () => {
        const id = '5e7b00d3914cb7438a60abc1s';
        const data = {
            title: 'title update',
            status: 'DONE',
        };
        await updateService.updateToDo(id, data).should.rejectedWith('id 형식이 맞지 않습니다.');
        Todo.updateOne.called.should.not.ok();
    });
    it('할 일의 상태가 TODO/IN_PROGRESS/DONE이 아니면 에러를 반환한다', async () => {
        const id = '5e7b00d3914cb7438a60abc1';
        const data = {
            title: 'title',
            status: 'DONE2',
        };
        await updateService.updateToDo(id, data).should.rejectedWith('status 값이 맞지 않습니다.');
        Todo.updateOne.called.should.not.ok();
    });
    it('할 일의 컨텍스트가 NONE/WORK/HOME이 아니면 에러를 반환한다', async () => {
        const id = '5e7b00d3914cb7438a60abc1';
        const data = {
            title: 'title',
            context: 'WORK!',
        };
        await updateService.updateToDo(id, data).should.rejectedWith('context 값이 맞지 않습니다.');
        Todo.updateOne.called.should.not.ok();
    });
    it('유효성 검사 통과 시 할 일을 업데이트 한다', async () => {
        const id = '5e7b00d3914cb7438a60abc1';
        const data = {
            title: 'title update',
            status: 'DONE',
        };
        await updateService.updateToDo(id, data);
        Todo.updateOne.called.should.ok();
    });
});
