import * as Yup from 'yup'
import Department from '../models/Department'

class DepartmentController {
  async index (ctx) {
    ctx.response.body = ({ ok: true })
  }

  async findById (ctx) {
    try {
      const department = await Department.findByPk(ctx.params.id)

      if (!department) {
        ctx.status = 404
        return
      }
      ctx.status = 200
      ctx.response.body = department
    } catch (err) {
      ctx.status = 400
      ctx.response.body = err
    }
  }

  async store (ctx) {
    const schema = Yup.object().shape({
      name: Yup.string().required().min(2).strict()
    })

    if (!(await schema.isValid(ctx.request.body))) {
      ctx.status = 400
      ctx.response.body = { error: 'Validation fails ' }
      return ctx.response.body
    }

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
    const schema = Yup.object().shape({
      name: Yup.string().min(2).strict()
    })

    if (!(await schema.isValid(ctx.request.body))) {
      ctx.status = 400
      ctx.response.body = { error: 'Validation fails ' }
      return ctx.response.body
    }

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

  async delete (ctx) {
    try {
      const { id: departmentId, name } = await Department.findByPk(ctx.params.id)

      await Department.destroy({
        where: {
          id: departmentId
        }
      })
      ctx.status = 200
      ctx.response.body = {
        message: 'Departmento excluído',
        name
      }
    } catch (err) {
      ctx.status = 400
      ctx.response.body = ('Não foi possível excluir o department')
    }
  }
}

export default new DepartmentController()
