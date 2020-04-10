const sinon = require('sinon');
const mongoose = require('mongoose');
require('should');
require('sinon-mongoose');

describe('TODO 목록 조회 테스트', () => {
    let Todo;
    let getListService;
    let sandbox;
    let find;
    let totalCount;

    before(() => {
        mongoose.on = () => {};
        mongoose.createConnection = () => mongoose;

        Todo = require('../../../models/todo');
        getListService = require('../getListService');

        sandbox = sinon.createSandbox();
        find = sandbox.stub(Todo, 'find');
        totalCount = sandbox.stub(Todo, 'countDocuments');
    });
    after(() => {
        sandbox.restore();
    });
    describe('종료일이 시작일 보다 빠르면 에러를 반환한다', () => {
        it('마감 예정일 날짜 비교', async () => {
            const data = {
                startDueDate: '2021-03-20',
                endDueDate: '2020-03-21',
            };
            await getListService
                .getToDoList(data)
                .should.rejectedWith('조회 종료일은 조회 시작일보다 빠를 수 없습니다.');
        });
        it('완료일 날짜 비교', async () => {
            const data = {
                startDoneAt: '2021-03-20',
                endDoneAt: '2020-03-21',
            };
            await getListService
                .getToDoList(data)
                .should.rejectedWith('조회 종료일은 조회 시작일보다 빠를 수 없습니다.');
        });
        it('생성일 날짜 비교', async () => {
            const data = {
                startCreatedAt: '2021-03-20',
                endCreatedAt: '2020-03-21',
            };
            await getListService
                .getToDoList(data)
                .should.rejectedWith('조회 종료일은 조회 시작일보다 빠를 수 없습니다.');
        });
    });

    it('page 값이 올바르지 않으면 에러를 반환한다', async () => {
        const data = {
            page: '2s',
        };
        await getListService.getToDoList(data).should.rejectedWith('page 값이 올바르지 않습니다.');
    });
    it('날짜 형식이 맞지 않으면 에러를 반환한다', async () => {
        const data = {
            startCreatedAt: '2020-03-25s',
            endCreatedAt: '2020-03-30',
        };

        await getListService.getToDoList(data).should.rejectedWith('날짜 형식이 맞지 않습니다.');
    });
    it('유효성 검사 통과 시 할 일 목록을 조회한다', async () => {
        const data = {
            title: '우유',
            startDueDate: '2020-03-24',
            endDueDate: '2020-03-30',
            startDoneAt: '',
            endDoneAt: '',
            // startCreatedAt: '2020-03-25s',
            endCreatedAt: '2020-03-30',
            page: 1,
        };

        const expectResult = {
            items: [
                {
                    status: 'IN_PROGRESS',
                    context: 'NONE',
                    _id: '5e7b00d3914cb7438a60abc1',
                    title: '우유',
                    dueDate: '2020-03-25T00:00:00.000Z',
                    createdAt: '2020-03-25T06:57:23.144Z',
                    __v: 0,
                },
            ],
            totalCount: 1,
        };

        find.withArgs({
            title: /우유/,
            dueDate: { $gte: '2020-03-24', $lt: '2020-03-31' },
            createdAt: { $lt: '2020-03-31' },
        }).resolves([
            {
                status: 'IN_PROGRESS',
                context: 'NONE',
                _id: '5e7b00d3914cb7438a60abc1',
                title: '우유',
                dueDate: '2020-03-25T00:00:00.000Z',
                createdAt: '2020-03-25T06:57:23.144Z',
                __v: 0,
            },
        ]);
        totalCount.resolves(1);

        await getListService.getToDoList(data).should.fulfilledWith(expectResult);
        Todo.countDocuments.called.should.ok();
        Todo.find.called.should.ok();
    });
});
