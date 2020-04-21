import request from 'supertest'
import app from '../src/server'
import Database from '../src/database/index'

import Inventory from '../src/app/models/Inventory'

describe('Test Inventories endpoints', () => {
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

  test('Should save an Inventory', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Inventario GSW', description: 'inventario cds - GSW' })
    expect(response.statusCode).toBe(201)
  })

  test('Should return bad request - invalid description < 10', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Inventario GSW', description: 'cds - GSW' })
    expect(response.statusCode).toBe(400)
  })

  test('Should return bad request - invalid name', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: '', description: 'inventario cds - GSW' })
    expect(response.statusCode).toBe(400)
  })

  test('Should return bad request - invalid date', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: '', description: 'inventario cds - GSW', end_date: '22/05/2020' })
    expect(response.statusCode).toBe(400)
  })

  test('Should return bad request - invalid date', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'gsw', description: 'inventario cds - GSW', end_date: '20-06-20T22:36:30' })
    expect(response.statusCode).toBe(400)
  })

  test('Should save an inventory - testing date', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'gsw', description: 'inventario cds - GSW', end_date: '2020-05-20T22:36:30' })
    expect(response.statusCode).toBe(201)
  })

  test('Should response bad request error - missing description', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Inventario GSW' })
    expect(response.statusCode).toBe(400)
  })

  test('Should response bad request error - missing name', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ description: 'inventario cds - GSW' })
    expect(response.statusCode).toBe(400)
  })

  test('Should response bad request error - missing name != nome', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ nome: 'Inventario GSW', description: 'inventario cds - GSW' })
    expect(response.statusCode).toBe(400)
  })

  test('Should update name an Inventory', async () => {
    const inventory = await Inventory.create({ name: 'Inventario GSW', description: 'inventario cds - GSW' })

    expect(inventory.name).toBe('Inventario GSW')

    const response = await request(app)
      .put('/inventory/' + inventory.id)
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'GSW' })
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe('GSW')
    expect(response.body.end_date).toBe(null)
  })

  test('Should response bad request - update invalid name', async () => {
    const inventory = await Inventory.create({ name: 'Inventario GSW', description: 'inventario cds - GSW' })

    expect(inventory.name).toBe('Inventario GSW')

    const response = await request(app)
      .put('/inventory/' + inventory.id)
      .set('Authorization', 'bearer ' + token)
      .send({ name: '' })
    expect(response.statusCode).toBe(400)
  })

  test('Should update end_date an Inventory', async () => {
    const inventory = await Inventory.create({ name: 'Inventario GSW', description: 'inventario cds - GSW' })

    const response = await request(app)
      .put('/inventory/' + inventory.id)
      .set('Authorization', 'bearer ' + token)
      .send({ end_date: '2020-04-20T22:36:30.001Z' })
    expect(response.body.end_date).toBe('2020-04-20T22:36:30.001Z')
  })

  test('Should return bad request - missing id', async () => {
    const id = null

    const response = await request(app)
      .put('/inventory/' + id)
      .set('Authorization', 'bearer ' + token)
      .send({ end_date: '2020-04-20T22:36:30.001Z' })
    expect(response.status).toBe(400)
  })
})

afterAll(async done => {
  await Database.connection.models.Inventory.truncate({ cascade: true })
  await Database.connection.close()
  app.close()
  done()
})
