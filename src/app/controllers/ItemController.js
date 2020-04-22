import * as Yup from 'yup'
import Item from '../models/Item'

class ItemController {
  async index (ctx) {
    ctx.response.body = ({ ok: true })
  }

  async findById (ctx) {
    try {
      const item = await Item.findByPk(ctx.params.id)

      if (!item) {
        ctx.status = 404
        return
      }
      ctx.status = 200
      ctx.response.body = item
    } catch (err) {
      ctx.status = 400
      ctx.response.body = err
    }
  }

  async store (ctx) {
    const schema = Yup.object().shape({
      name: Yup.string().required().strict(),
      department_id: Yup.number().required().strict()
    })

    if (!(await schema.isValid(ctx.request.body))) {
      ctx.status = 400
      ctx.response.body = { error: 'Validation fails ' }
      return ctx.response.body
    }

    try {
      const { id, name, department_id: depId } = await Item.create(ctx.request.body)
      ctx.status = 201
      ctx.response.body = ({
        id,
        name,
        depId
      })
    } catch (err) {
      ctx.status = 400
      ctx.response.body = ('Não foi possível inserir o item')
    }
  }

  async update (ctx) {
    const schema = Yup.object().shape({
      name: Yup.string().strict(),
      department_id: Yup.number().strict()
    })

    if (!(await schema.isValid(ctx.request.body))) {
      ctx.status = 400
      ctx.response.body = { error: 'Validation fails ' }
      return ctx.response.body
    }

    try {
      const item = await Item.findByPk(ctx.params.id)

      const { id, name, department_id: depId } = await item.update(ctx.request.body)
      ctx.status = 200
      ctx.response.body = ({
        id,
        name,
        depId
      })
    } catch (err) {
      ctx.status = 400
      ctx.response.body = (err)
    }
  }
}

export default new ItemController()
