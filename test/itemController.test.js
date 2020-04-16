import request from 'supertest'
import app from '../src/server'
import Database from '../src/database/index'

describe('Test Users endpoints', () => {

  test('Should save an user', async () => {
    const response = await request(app)
      .post('/item')
      .send({ name: 'Cadeira' })
    expect(response.statusCode).toBe(201)
  })

  test('Should response bad request error', async () => {
    const response = await request(app)
      .post('/item')
      .send({ nome: 'Cadeira' })
    expect(response.statusCode).toBe(400)
  })
})

afterAll(async () => {
  await Database.connection.sync({ force: true })
  app.close()
})
