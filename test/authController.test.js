import request from 'supertest'
import app from '../src/server'
import Database from '../src/database/index'

describe('Test Auth Endpoint endpoints', () => {
  test('Generate Token', async () => {
    await request(app)
      .post('/users')
      .send({ name: 'Gabriel', email: 'user2@email.com', password: 'password' })

    const response = await request(app)
      .post('/auth')
      .send({ email: 'user2@email.com', password: 'password' })

    expect(response.statusCode).toBe(201)
  })
})

afterAll(async done => {
  await Database.connection.models.User.truncate({ cascade: true })
  await Database.connection.close()
  app.close()
  done()
})
