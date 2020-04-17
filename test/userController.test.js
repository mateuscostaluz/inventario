import request from 'supertest'
import app from '../src/server'
import Database from '../src/database/index'

describe('Test Users endpoints', () => {
  test('Should save an user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Gabriel', email: 'user@email.com', password: 'password' })
    expect(response.statusCode).toBe(201)
  })

  test('Should response conflict error', async () => {
    await request(app)
      .post('/users')
      .send({ name: 'Gabriel', email: 'user2@email.com', password: 'password' })
    const response = await request(app)
      .post('/users')
      .send({ name: 'Gabriel', email: 'user2@email.com', password: 'password' })
    expect(response.statusCode).toBe(409)
  })

  test('Should list all users', async () => {
    await Database.connection.models.User.truncate()

    await request(app)
      .post('/users')
      .send({ name: 'Usuario 1', email: 'user3@email.com', password: 'password' })
    await request(app)
      .post('/users')
      .send({ name: 'Usuario 2', email: 'user4@email.com', password: 'password' })

    const authResponse = await request(app)
      .post('/auth')
      .send({ email: 'user3@email.com', password: 'password' })

    const { token } = authResponse.body

    const response = await request(app)
      .get('/users')
      .set('Authorization', 'bearer ' + token)
    const { body } = response
    expect(body.length).toBe(2)
    expect(response.statusCode).toBe(200)
  })
})

afterAll(async () => {
  await Database.connection.models.User.truncate()
  app.close()
})
