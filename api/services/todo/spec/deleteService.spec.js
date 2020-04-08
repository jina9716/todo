const sinon = require('sinon');
const mongoose = require('mongoose');
require('should');
require('sinon-mongoose');

describe('TODO 삭제 테스트', () => {
    let Todo;
    let deleteService;
    let sandbox;

    before(() => {
        mongoose.on = () => {};
        mongoose.createConnection = () => mongoose;

        Todo = require('../../../models/todo');
        deleteService = require('../deleteService');

        sandbox = sinon.createSandbox();
        sandbox.stub(Todo, 'deleteOne');
    });
    after(() => {
        sandbox.restore();
    });
    it('id가 올바르지 않으면 에러를 반환한다', async () => {
        const id = '5e7b00d3914cb7438a60abc1s';
        // if (!Todo.isValidId(id)){
        //     console.log('error');
        // }
        await deleteService.deleteToDo(id).should.rejectedWith('id 형식이 맞지 않습니다.');
        Todo.deleteOne.called.should.not.ok();
    });
    it('정상 작동 시 deleteOne 호출 하는지 체크', async () => {
        const id = '5e7b00d3914cb7438a60abc1';
        await deleteService.deleteToDo(id);
        Todo.deleteOne.called.should.ok();
    });
});
