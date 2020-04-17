import request from 'supertest'
import app from '../src/server'
import Database from '../src/database/index'

import Item from '../src/app/models/Item'

describe('Test Items endpoints', () => {

  test('Should save an item', async () => {
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

  test('', async () => {
    const { id } = await Item.create({ name: 'Cadeira' })
    const response = await request(app)
      .put('/item/' + id)
      .send({ name: 'Mesa' })
    expect(response.statusCode).toBe(200)
  })
})

afterAll(async () => {
  await Database.connection.sync({ force: true })
  app.close()
})
