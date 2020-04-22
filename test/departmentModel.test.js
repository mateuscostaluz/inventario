import Department from '../src/app/models/Department'
import Database from '../src/database/index'

test('Saving and Deleting Department', async () => {
  const department = await Department.create({ name: 'Department' })
  expect(department.id).not.toBeNull()
  await department.destroy()
})

test('Updating and Deleting Department', async () => {
  const department = await Department.create({ name: 'Department' })
  const newName = 'Novo nome'
  department.name = newName
  await department.save()
  await department.reload()
  expect(department.name).toBe(newName)
  await department.destroy()
})

afterAll(async done => {
  await Database.connection.close()
  done()
})
