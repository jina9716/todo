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
    it('status가 TODO/IN_PROGRESS/DONE이 아니면 에러를 반환한다', async () => {
        const id = '5e7b00d3914cb7438a60abc1';
        const data = {
            title: 'title',
            status: 'DONE2',
        };
        await updateService.updateToDo(id, data).should.rejectedWith('status 값이 맞지 않습니다.');
        Todo.updateOne.called.should.not.ok();
    });
    it('context가 NONE/WORK/HOME이 아니면 에러를 반환한다', async () => {
        const id = '5e7b00d3914cb7438a60abc1';
        const data = {
            title: 'title',
            context: 'WORK!',
        };
        await updateService.updateToDo(id, data).should.rejectedWith('context 값이 맞지 않습니다.');
        Todo.updateOne.called.should.not.ok();
    });
    it('정상 작동 시 updateOne 호출 하는지 체크', async () => {
        const id = '5e7b00d3914cb7438a60abc1';
        const data = {
            title: 'title update',
            status: 'DONE',
        };
        await updateService.updateToDo(id, data);
        Todo.updateOne.called.should.ok();
    });
});
