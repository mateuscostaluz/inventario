import request from 'supertest'
import app from '../src/server'
import Database from '../src/database/index'

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
})

afterAll(async done => {
  await Database.connection.models.Inventory.destroy({ truncate: true, cascade: true })
  app.close()
  done()
})
