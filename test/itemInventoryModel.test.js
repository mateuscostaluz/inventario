import Item from '../src/app/models/Item'
import ItemInventory from '../src/app/models/ItemInventory'
import Inventory from '../src/app/models/Inventory'
import User from '../src/app/models/User'
import Department from '../src/app/models/Department'
import Database from '../src/database/index'

import truncate from './util/truncate'

test('Creating ItemInventory', async done => {
  // TODO: Criar uma instancia da classe ItemInventory
  const department = await Department.create({ name: 'RH' })
  const item = await Item.create({ name: 'Cadeira', department_id: department.id })
  const user = await User.create({ name: 'User', email: 'email@email.com', password: '123' })
  const inventory = await Inventory.create({ name: 'Inventorio 1', description: 'Descrição', department_id: department.id })

  const itemInventory = await ItemInventory.create(
    {
      user_id: user.id,
      department_id: department.id,
      inventory_id: inventory.id,
      item_id: item.id,
      item_found_on_system: true,
      surplus: false
    })
  expect(itemInventory).not.toBeNull()
  done()
})

afterAll(async done => {
  await truncate()
  await Database.connection.close()
  done()
})
