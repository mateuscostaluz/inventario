import request from 'supertest'
import app from '../src/server'
import Database from '../src/database/index'

import Department from '../src/app/models/Department'
import Inventory from '../src/app/models/Inventory'
import Item from '../src/app/models/Item'
import ItemInventory from '../src/app/models/ItemInventory'
import User from '../src/app/models/User'

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
      .send({ name: 'Inventario 01', description: 'Descrição 0001' })
    expect(response.statusCode).toBe(201)
  })

  test('Listar items do inventário', async () => {
    const department = await Department.create({ name: 'RH' })
    const item = await Item.create({ name: 'Cadeira', department_id: department.id })
    const item2 = await Item.create({ name: 'Mesa', department_id: department.id })
    const item3 = await Item.create({ name: 'Notebook', department_id: department.id })
    const user = await User.create({ name: 'User', email: 'email@email.com', password: '123' })
    const inventory = await Inventory.create({ name: 'Inventorio 1', description: 'Descrição', department_id: department.id })

    const data = [
      {
        user_id: user.id,
        department_id: department.id,
        inventory_id: inventory.id,
        item_id: item.id,
        item_found_on_system: true,
        surplus: false
      },
      {
        user_id: user.id,
        department_id: department.id,
        inventory_id: inventory.id,
        item_id: item2.id,
        item_found_on_system: true,
        surplus: false
      },
      {
        user_id: user.id,
        department_id: department.id,
        inventory_id: inventory.id,
        item_id: item3.id,
        item_found_on_system: true,
        surplus: false
      }]

    await ItemInventory.bulkCreate(data)

    const response = await request(app)
      .get('/inventory/' + inventory.id)
      .set('Authorization', 'bearer ' + token)

    expect(response.statusCode).toBe(200)
  })

  test('Should return bad request - invalid description < 10', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Inventario 01', description: 'Descrição' })
    expect(response.statusCode).toBe(400)
  })

  test('Should return bad request - invalid name', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: '', description: 'Descrição 0001' })
    expect(response.statusCode).toBe(400)
  })

  test('Should return bad request - invalid date', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: '', description: 'Descrição 0001', end_date: '22/05/2020' })
    expect(response.statusCode).toBe(400)
  })

  test('Should return bad request - invalid date', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Inventario 01', description: 'Descrição 0001', end_date: '20-06-20T22:36:30' })
    expect(response.statusCode).toBe(400)
  })

  test('Should save an inventory - testing date', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Inventario 01', description: 'Descrição 0001', end_date: '2020-05-20T22:36:30' })
    expect(response.statusCode).toBe(201)
  })

  test('Should response bad request error - missing description', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Inventario 01' })
    expect(response.statusCode).toBe(400)
  })

  test('Should response bad request error - missing name', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ description: 'Descrição 0001' })
    expect(response.statusCode).toBe(400)
  })

  test('Should response bad request error - missing name != nome', async () => {
    const response = await request(app)
      .post('/inventory')
      .set('Authorization', 'bearer ' + token)
      .send({ nome: 'Inventario 01', description: 'Descrição 0001' })
    expect(response.statusCode).toBe(400)
  })

  test('Should update name an Inventory', async () => {
    const inventory = await Inventory.create({ name: 'Inventario 01', description: 'Descrição 0001' })

    expect(inventory.name).toBe('Inventario 01')

    const response = await request(app)
      .put('/inventory/' + inventory.id)
      .set('Authorization', 'bearer ' + token)
      .send({ name: 'Inventario 01', description: 'Descrição 0001' })
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe('Inventario 01')
    expect(response.body.end_date).toBe(null)
  })

  test('Should response bad request - update invalid name', async () => {
    const inventory = await Inventory.create({ name: 'Inventario 01', description: 'Descrição 0001' })

    expect(inventory.name).toBe('Inventario 01')

    const response = await request(app)
      .put('/inventory/' + inventory.id)
      .set('Authorization', 'bearer ' + token)
      .send({ name: '' })
    expect(response.statusCode).toBe(400)
  })

  test('Should update end_date an Inventory', async () => {
    const inventory = await Inventory.create({ name: 'Inventario 01', description: 'Descrição 0001' })

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

  test('Should delete an Inventory', async () => {
    const { id } = await Inventory.create({ name: 'Inventario 01', description: 'Descrição 0001' })
    const response = await request(app)
      .delete('/inventory/' + id)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toBe('Inventario 01')
  })

  test('Should return error while deleting inventory', async () => {
    const response = await request(app)
      .delete('/inventory/' + 1)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(400)
    expect(response.body.error).toBe('Erro ao deletar inventário')
  })

  test('Should return ', async () => {
    const department = await Department.create({ name: 'Depart01' })
    const item = await Item.create({ name: 'Cadeira', department_id: department.id })
    const inventory = await Inventory.create({ name: 'Inventario 01', description: 'Descrição 0001', department_id: department.id })

    let response = await request(app)
      .post('/iteminventory')
      .set('Authorization', 'bearer ' + token)
      .send({ inventory_id: inventory.id, item_id: item.id })
    expect(response.statusCode).toBe(201)

    response = await request(app)
      .delete('/inventory/' + inventory.id)
      .set('Authorization', 'bearer ' + token)
    expect(response.statusCode).toBe(401)
    expect(response.body.error).toBe('Não é possível apagar um inventario que contenha item')
  })
})

afterAll(async done => {
  await Database.connection.models.Department.truncate({ cascade: true })
  await Database.connection.models.Item.truncate({ cascade: true })
  await Database.connection.models.ItemInventory.truncate({ cascade: true })
  await Database.connection.models.Inventory.truncate({ cascade: true })
  await Database.connection.models.User.truncate({ cascade: true })
  await Database.connection.close()
  app.close()
  done()
})
