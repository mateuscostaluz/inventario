import request from 'supertest'
import app from '../src/server'
import Database from '../src/database'

import Item from '../src/app/models/Item'
import ItemInventory from '../src/app/models/ItemInventory'
import Inventory from '../src/app/models/Inventory'
import User from '../src/app/models/User'
import Department from '../src/app/models/Department'

import truncate from './util/truncate'

describe('Test ItemInventory endpoints', () => {
  let token
  let department
  let item
  let inventory
  let userId

  beforeAll(async () => {
    const { id: UserId } = await User.create({
      name: 'Usuario', email: 'user1235@email.com', password: 'password'
    })

    userId = UserId

    const authResponse = await request(app)
      .post('/auth')
      .send({ email: 'user1235@email.com', password: 'password' })

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
    expect(response.body).toStrictEqual({ error: 'Impossível criar item, inventário já encerrado' })
  })

  test('Should Response 400 - Item não encontrado', async () => {
    const inventory2 = await Inventory.create({
      name: 'Inventario 02',
      description: 'Descrição 0001',
      department_id: department.id
    })
    const response = await request(app)
      .post('/iteminventory')
      .set('Authorization', 'bearer ' + token)
      .send({ inventory_id: inventory2.id, item_id: -1 })
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual({ error: 'Item não encontrado' })
  })

  test('Should Response 204 - Item excluído', async () => {
    const item2 = await Item.create({
      name: 'Item',
      department_id: department.id
    })

    const { id } = await Inventory.create({
      name: 'Inventario 01',
      description: 'Descrição 0001',
      department_id: department.id
    })

    await ItemInventory.create({
      inventory_id: id,
      item_id: item2.id,
      user_id: userId,
      item_found_on_system: true,
      surplus: false
    })
    const response = await request(app)
      .delete('/iteminventory/' + item2.id + '/' + id)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(204)
  })

  test('Should Response 400 - Não foi possível excluir o item do inventário', async () => {
    const response = await request(app)
      .delete('/iteminventory/' + (-1) + '/' + (-1))
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(400)
  })

  test('Should Response 400 - Impossível excluir item, inventário já encerrado', async () => {
    const item3 = await Item.create({
      name: 'Item',
      department_id: department.id
    })

    await ItemInventory.create({
      inventory_id: inventory.id,
      item_id: item3.id,
      user_id: userId,
      item_found_on_system: true,
      surplus: false
    })
    const response = await request(app)
      .delete('/iteminventory/' + item3.id + '/' + inventory.id)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(400)
    expect(response.body).toStrictEqual({ error: 'Impossível excluir item, inventário já encerrado' })
  })
})

afterAll(async done => {
  await truncate()
  await Database.connection.close()
  app.close()
  done()
})
