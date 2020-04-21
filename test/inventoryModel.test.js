import Inventory from '../src/app/models/Inventory'
import Database from '../src/database/index'

test('Saving and Deleting Inventario', async () => {
  const inventory = await Inventory.create({ name: 'GSW Inventory', description: 'inventario cds e RH' })
  expect(inventory.id).not.toBeNull()
  await inventory.destroy()
})

test('Updating and Deleting Inventory', async () => {
  const inventory = await Inventory.create({ name: 'GSW Inventory', description: 'inventario cds e RH' })
  const newName = 'Novo nome'
  const newDescription = 'Nova Descricao'
  inventory.name = newName
  inventory.description = newDescription
  await inventory.save()
  await inventory.reload()
  expect(inventory.name).toBe(newName)
  expect(inventory.description).toBe(newDescription)
  await inventory.destroy()
})

afterAll(async done => {
  await Database.connection.close()
  done()
})
