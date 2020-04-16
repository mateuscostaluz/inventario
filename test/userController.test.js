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
      .send({ name: 'Gabriel', email: 'user@email.com', password: 'password' })
    const response = await request(app)
      .post('/users')
      .send({ name: 'Gabriel', email: 'user@email.com', password: 'password' })
    expect(response.statusCode).toBe(409)
  })
})

afterAll(async () => {
  await Database.connection.sync({ force: true })
  app.close()
})
