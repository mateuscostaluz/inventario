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

  test('Should response bad request error', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Inventario GSW' })
    expect(response.statusCode).toBe(400)
  })

  test('Should response bad request error', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ description: 'inventario cds - GSW' })
    expect(response.statusCode).toBe(400)
  })

  test('Should save an Inventory', async () => {
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
    expect(response.body.name).toBe('GSW')
    expect(response.body.end_date).toBe(null)
  })

  test('Should update end_date an Inventory', async () => {
    const inventory = await Inventory.create({ name: 'Inventario GSW', description: 'inventario cds - GSW' })

    const response = await request(app)
      .put('/inventory/' + inventory.id)
      .set('Authorization', 'bearer ' + token)
      .send({ end_date: '2020-04-20T22:36:30.001Z' })
    expect(response.body.end_date).toBe('2020-04-20T22:36:30.001Z')
  })

  test('Should return bad request', async () => {
    const id = null

    const response = await request(app)
      .put('/inventory/' + id)
      .set('Authorization', 'bearer ' + token)
      .send({ end_date: '2020-04-20T22:36:30.001Z' })
    expect(response.status).toBe(400)
  })
})

afterAll(async done => {
  await Database.connection.models.Inventory.destroy({ truncate: true, cascade: true })
  app.close()
  done()
})
