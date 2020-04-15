import User from '../src/app/models/User'
import Database from '../src/database/index'

test('Saving and Deleting User', async () => {
  const user = await User.create({ name: 'User', email: 'user2@email.com', password: 'password' })
  expect(user.id).not.toBeNull()
  await user.destroy()
})

test('Updating and Deleting User', async () => {
  const user = await User.create({ name: 'User', email: 'user2@email.com', password: 'password' })
  const newName = 'Novo nome'
  user.name = newName
  await user.save()
  await user.reload()
  expect(user.name).toBe(newName)
  await user.destroy()
})

afterAll(async done => {
  Database.connection.close()
  done()
})
