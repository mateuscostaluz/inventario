import Department from '../models/Department'

class DepartmentController {
  async index (ctx) {
    ctx.response.body = ({ ok: true })
  }

  async store (ctx) {
    try {
      const { id, name } = await Department.create(ctx.request.body)
      ctx.status = 201
      ctx.response.body = ({
        id,
        name
      })
    } catch (err) {
      ctx.status = 400
      ctx.response.body = ('Não foi possível inserir o departamento')
    }
  }

  async update (ctx) {
    try {
      const department = await Department.findByPk(ctx.params.id)

      const { id, name } = await department.update(ctx.request.body)
      ctx.status = 200
      ctx.response.body = ({
        id,
        name
      })
    } catch (err) {
      ctx.status = 400
      ctx.response.body = (err)
    }
  }
}

export default new DepartmentController()
