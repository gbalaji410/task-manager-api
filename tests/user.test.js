const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Balaji',
        email: 'balaji2104@gmail.com',
        password: 'mypass123!'
    }).expect(201)

    //Assert that database was updated correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the reponse
    expect(response.body).toMatchObject({
        user: {
            name: 'Balaji', 
            email: 'balaji2104@gmail.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('mypass123!')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'randompass123!'
    }).expect(400)
})

test('Should get profile for authenticated user', async () => {
    await request(app)
          .get('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)
})

test('Should not get profile for non-authenticated user', async () => {
    await request(app)
          .get('/users/me')
          .send()
          .expect(401)
})

test('Should delete profile for authenticated user', async () => {
    const response = await request(app)
          .delete('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)

    //Assert that database was updated correctly
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete profile for non-authenticated user', async () => {
    await request(app)
          .delete('/users/me')
          .send()
          .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
          .patch('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send({
              name: 'Sheetal Balaji'
          })
          .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Sheetal Balaji')
})

test('Should not update invalid user fields', async () => {
    await request(app)
          .patch('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send({
              location: 'San Jose'
          })
          .expect(400)
})