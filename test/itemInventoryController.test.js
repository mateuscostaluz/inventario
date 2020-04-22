import request from 'supertest'
import app from '../src/server'
import Database from '../src/database'

import Department from '../src/app/models/Department'
import Item from '../src/app/models/Item'
import Inventory from '../src/app/models/Inventory'

describe('Test ItemInventory endpoints', () => {
  let token
  let department
  let item
  let inventory

  beforeAll(async () => {
    await request(app)
      .post('/users')
      .send({ name: 'Usuario', email: 'user123@email.com', password: 'password' })

    const authResponse = await request(app)
      .post('/auth')
      .send({ email: 'user123@email.com', password: 'password' })

    token = authResponse.body.token

    department = await Department.create({ name: 'Depart01' })
    item = await Item.create({ name: 'Cadeira', department_id: department.id })
    inventory = await Inventory.create({ name: 'Inventario 01', description: 'Descrição 0001', department_id: department.id })
  })

  test('Should save an Item on the Inventory', async () => {
    const response = await request(app)
      .post('/iteminventory')
      .set('Authorization', 'bearer ' + token)
      .send({ inventory_id: inventory.id, item_id: item.id })
    expect(response.statusCode).toBe(201)
  })

  test('Should Response 400 - Parametros Inválidos', async () => {
    const response = await request(app)
      .post('/iteminventory')
      .set('Authorization', 'bearer ' + token)
      .send({ inventory_id: inventory.id })
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual({ error: 'Parametros Inválidos' })
  })

  test('Should Response 400 - Inventário já está fechado', async () => {
    inventory.end_date = new Date()
    await inventory.save()
    const response = await request(app)
      .post('/iteminventory')
      .set('Authorization', 'bearer ' + token)
      .send({ inventory_id: inventory.id, item_id: item.id })
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual({ error: 'Inventário já está fechado' })
  })

  test('Should Response 400 - Item não encontrado', async () => {
    const inventory2 = await Inventory.create({ name: 'Inventario 02', description: 'Descrição 0001', department_id: department.id })
    const response = await request(app)
      .post('/iteminventory')
      .set('Authorization', 'bearer ' + token)
      .send({ inventory_id: inventory2.id, item_id: -1 })
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual({ error: 'Item não encontrado' })
  })
})

afterAll(async done => {
  await Database.connection.models.Department.truncate({ cascade: true })
  await Database.connection.models.Inventory.truncate({ cascade: true })
  await Database.connection.models.Item.truncate({ cascade: true })
  await Database.connection.models.ItemInventory.truncate({ cascade: true })
  await Database.connection.close()
  app.close()
  done()
})
