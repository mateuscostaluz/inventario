import Item from '../src/app/models/Item'
import ItemInventory from '../src/app/models/ItemInventory'
import Inventory from '../src/app/models/Inventory'
import User from '../src/app/models/User'
import Department from '../src/app/models/Department'
import Database from '../src/database/index'

test('Creating ItemInventory', async done => {
  // TODO: Criar uma instancia da classe ItemInventory
  const department = await Department.create({ name: 'RH' })
  const item = await Item.create({ name: 'Cadeira', department_id: department.id })
  const user = await User.create({ name: 'User', email: 'email@email.com', password: '123' })
  const inventory = await Inventory.create({ name: 'Inventorio 1', description: 'Descrição' })

  const itemInventory = await ItemInventory.create(
    {
      id_user: user.id,
      id_department: department.id,
      id_inventory: inventory.id,
      id_item: item.id,
      item_found_on_system: true,
      surplus: false
    })
  expect(itemInventory).not.toBeNull()
  done()
})

afterAll(async done => {
  const { models } = Database.connection
  await models.Department.truncate({ cascade: true })
  await models.Item.truncate({ cascade: true })
  await models.ItemInventory.truncate({ cascade: true })
  await models.Inventory.truncate({ cascade: true })
  await models.User.truncate({ cascade: true })
  await Database.connection.close()
  done()
})
