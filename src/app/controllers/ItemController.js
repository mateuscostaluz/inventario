import Item from '../models/Item'

class ItemController {
  async index (ctx) {
    ctx.response.body = ({ ok: true })
  }

  async store (ctx) {
    try {
      const { id, name } = await Item.create(ctx.request.body)
      ctx.status = 201
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

export default new ItemController()
