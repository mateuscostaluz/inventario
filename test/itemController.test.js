import request from 'supertest'
import app from '../src/server'
import Database from '../src/database'

import Item from '../src/app/models/Item'
import Department from '../src/app/models/Department'

describe('Test Items endpoints', () => {
  let token
  let depId

  beforeAll(async () => {
    await request(app)
      .post('/users')
      .send({ name: 'Usuario', email: 'user123@email.com', password: 'password' })

    const authResponse = await request(app)
      .post('/auth')
      .send({ email: 'user123@email.com', password: 'password' })

    token = authResponse.body.token

    const { id } = await Department.create({ name: 'Depart01' })

    depId = id
    console.log(depId)
  })

  test('Should save an Item', async () => {
    const response = await request(app)
      .post('/item')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Cadeira', department_id: depId })
    expect(response.statusCode).toBe(201)
  })

  test('Should response bad request error', async () => {
    const response = await request(app)
      .post('/item')
      .set('Authorization', 'bearer ' + token)
      .send({ nome: 'Cadeira' })
    expect(response.statusCode).toBe(400)
  })

  test('Should update an item', async () => {
    const { id } = await Item.create({ name: 'Cadeira', department_id: depId })
    const response = await request(app)
      .put('/item/' + id)
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Mesa', department_id: depId })
    expect(response.statusCode).toBe(200)
  })

  test('Should response bad request error for an update', async () => {
    const id = null
    const response = await request(app)
      .put('/item/' + id)
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Mesa' })
    expect(response.statusCode).toBe(400)
  })

  test('Should find item by PK', async () => {
    const { id } = await Item.create({ name: 'Cadeira' })
    const response = await request(app)
      .get('/item/' + id)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe('Cadeira')
  })

  test('Should find item by PK and response 404 ', async () => {
    const id = -1
    const response = await request(app)
      .get('/item/' + id)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(404)
  })
})

afterAll(async () => {
  await Database.connection.models.Item.truncate()
  app.close()
})
