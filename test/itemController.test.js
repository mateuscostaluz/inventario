import request from 'supertest'
import app from '../src/server'
import Database from '../src/database/index'

describe('Test Users endpoints', () => {

  let token

  beforeAll(async () => {
    await request(app)
      .post('/users')
      .send({ name: 'Usuario', email: 'user123@email.com', password: 'password' })

    const authResponse = await request(app)
      .post('/auth')
      .send({ email: 'user123@email.com', password: 'password' })

    token = authResponse.body.token
  })

  test('Should save an Item', async () => {
    const response = await request(app)
      .post('/item')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Cadeira' })
    expect(response.statusCode).toBe(201)
  })

  test('Should response bad request error', async () => {
    const response = await request(app)
      .post('/item')
      .set('Authorization', 'bearer ' + token)
      .send({ nome: 'Cadeira' })
    expect(response.statusCode).toBe(400)
  })
})

afterAll(async () => {
  await Database.connection.models.Item.truncate()
  app.close()
})
