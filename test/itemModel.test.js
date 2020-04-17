import Item from '../src/app/models/Item'
import Database from '../src/database/index'

test('Saving and Deleting Item', async () => {
  const item = await Item.create({ name: 'Item' })
  expect(item.id).not.toBeNull()
  await item.destroy()
})

test('Updating and Deleting Item', async () => {
  const item = await Item.create({ name: 'Item' })
  const newName = 'Novo nome'
  item.name = newName
  await item.save()
  await item.reload()
  expect(item.name).toBe(newName)
  await item.destroy()
})

afterAll(async done => {
  Database.connection.close()
  done()
})
