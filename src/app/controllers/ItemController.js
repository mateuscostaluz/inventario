import Item from '../models/Item'

class ItemController {
  async index (ctx) {
    ctx.response.body = ({ ok: true })
  }

  async store (ctx) {
    try {
      const { id, name, department_fk } = await Item.create(ctx.request.body)
      ctx.status = 201
      ctx.response.body = ({
        id,
        name,
        department_fk
      })
    } catch (err) {
      ctx.status = 400
      ctx.response.body = ('Não foi possível inserir o item')
    }
  }

  async update (ctx) {
    try {
      const item = await Item.findByPk(ctx.params.id)

      const { id, name, department_fk } = await item.update(ctx.request.body)
      ctx.status = 200
      ctx.response.body = ({
        id,
        name,
        department_fk
      })
    } catch (err) {
      ctx.status = 400
      ctx.response.body = (err)
    }
  }
}

export default new ItemController()
