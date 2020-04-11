const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
    userOneId,
    userOne,
    setupDatabase,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree
 } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should Create task for User', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: "Fourth Task",
        owner: userOneId
    })
    .expect(201)

    const task = Task.findById(response.body._id)
    expect(task).not.toBeNull()
//    expect(task.completed).toEqual(false)
})

test('Should Get All Tasks for User', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should Not Delete Other Users Task', async () => {
    const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(404)

    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})