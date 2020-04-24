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

  test('Should response validation fails error', async () => {
    const response = await request(app)
      .post('/department')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'C' })
    expect(response.statusCode).toBe(400)
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

  test('Should response validation fails error during update', async () => {
    const { id } = await Department.create({ name: 'Tesouraria' })
    const response = await request(app)
      .put('/department/' + id)
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'T' })
    expect(response.statusCode).toBe(400)
  })

  test('Should response bad request error for an update', async () => {
    const id = null
    const response = await request(app)
      .put('/department/' + id)
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Desenvolvimento' })
    expect(response.statusCode).toBe(400)
  })

  test('Should find department by PK', async () => {
    const { id } = await Department.create({ name: 'RH' })
    const response = await request(app)
      .get('/department/' + id)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe('RH')
  })

  test('Should find department by PK and response 404 ', async () => {
    const id = -1
    const response = await request(app)
      .get('/department/' + id)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(400)
  })

  test('Should delete a department', async () => {
    const { id } = await Department.create({ name: 'Department' })
    const response = await request(app)
      .delete('/department/' + id)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe('Department')
  })

  test('Should response bad request error for delete', async () => {
    const id = -1
    const response = await request(app)
      .delete('/department/' + id)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(400)
  })

  afterAll(async done => {
    await Database.connection.models.Department.truncate({ cascade: true })
    await Database.connection.close()
    app.close()
    done()
  })
})
