import request from 'supertest'
import app from '../src/server'
import Database from '../src/database'

import Item from '../src/app/models/Item'
import Department from '../src/app/models/Department'

describe('Test Items endpoints', () => {
  let token
  let depId
  let itemId

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

    const { id: iId } = await Item.create({ name: 'Cadeira', department_id: depId })
    itemId = iId
  })

  test('Should save an Item', async () => {
    const response = await request(app)
      .post('/item')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Cadeira', department_id: depId })
    expect(response.statusCode).toBe(201)
  })

  test('Should response validation fails for name validation', async () => {
    const response = await request(app)
      .post('/item')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 1234, department_id: depId })
    expect(response.statusCode).toBe(400)
  })

  test('Should response validation fails for department id validation', async () => {
    const response = await request(app)
      .post('/item')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Mesa', department_id: 'valor' })
    expect(response.statusCode).toBe(400)
  })

  test('Should update an item', async () => {
    const response = await request(app)
      .put('/item/' + itemId)
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

  test('Should response bad request error for name validation on update', async () => {
    const response = await request(app)
      .put('/item/' + itemId)
      .set('Authorization', 'bearer ' + token)
      .send({ name: 14 })
    expect(response.statusCode).toBe(400)
  })

  test('Should response bad request error for department id validation on update', async () => {
    const response = await request(app)
      .put('/item/' + itemId)
      .set('Authorization', 'bearer ' + token)
      .send({ department_id: 'id' })
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

  test('Should delete an item', async () => {
    const { id } = await Item.create({ name: 'Item' })
    const response = await request(app)
      .delete('/item/' + id)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe('Item')
  })
})

afterAll(async done => {
  await Database.connection.models.Item.truncate({ cascade: true })
  app.close()
  done()
})
