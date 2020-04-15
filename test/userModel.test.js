import User from '../src/app/models/User'
import Database from '../src/database/index'

test('Saving User', async () => {
  const user = await User.create({ name: 'User', email: 'user2@email.com', password: 'password' })
  console.log(user)
  expect(user.id).not.toBeNull()
  await user.destroy()
})

afterAll(async done => {
  Database.connection.close()
  done()
})
