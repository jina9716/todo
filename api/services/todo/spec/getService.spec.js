const sinon = require('sinon');
const should = require('should');
const mongoose = require('mongoose');
require('sinon-mongoose');

describe('TODO 상세 조회 테스트', ()=>{
    let Todo;
    let getService;
    let sandbox;

    before(() => {
        mongoose.on = () => {};
        mongoose.createConnection = () => mongoose;

        Todo = require('../../../models/todo');
        getService = require('../getService');

        sandbox = sinon.createSandbox();
        let findOne = sandbox.stub(Todo, 'findOne');
        findOne.withArgs({_id: "5e7b00d3914cb7438a60abc1"}).resolves({
            "status": "IN_PROGRESS",
            "context": "NONE",
            "_id": "5e7b00d3914cb7438a60abc1",
            "title": "딸기4",
            "dueDate": "2020-03-25T00:00:00.000Z",
            "createdAt": "2020-03-25T06:57:23.144Z",
            "__v": 0
        });
    });
    after(() => {
        sandbox.restore();
    });
    it('id가 올바르지 않으면 에러를 반환한다', async () => {
        const id = "5e7b00d3914cb7438a60abc1s";
        // if (!Todo.isValidId(id)) {
        //    console.log("error!!");
        // }
        await getService.getToDo(id).should.rejectedWith('invalid id');
        Todo.findOne.called.should.not.ok();
    });
    it('id가 올바르면 정상 통과', async () =>{
        const id = "5e7b00d3914cb7438a60abc1";
        let result = await getService.getToDo(id);
        // console.log(result);
        Todo.findOne.called.should.ok();
    });
});