import request from 'supertest'
import app from '../src/server'
import Database from '../src/database/index'

import Department from '../src/app/models/Department'

describe('Test Departments endpoints', () => {
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

  test('Should save an Department', async () => {
    const response = await request(app)
      .post('/department')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Contabilidade' })
    expect(response.statusCode).toBe(201)
  })

  test('Should response bad request error', async () => {
    const response = await request(app)
      .post('/department')
      .set('Authorization', 'bearer ' + token)
      .send({ nome: 'Contabilidade' })
    expect(response.statusCode).toBe(400)
  })

  test('Should update an department', async () => {
    const { id } = await Department.create({ name: 'RH' })
    const response = await request(app)
      .put('/department/' + id)
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Desenvolvimento' })
    expect(response.statusCode).toBe(200)
  })

  test('Should response bad request error for an update', async () => {
    const id = null
    const response = await request(app)
      .put('/department/' + id)
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Desenvolvimento' })
    expect(response.statusCode).toBe(400)
  })
})

afterAll(async () => {
  await Database.connection.models.Department
    .destroy({ truncate: true, cascade: true })
  app.close()
})
