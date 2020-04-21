import Inventory from '../models/Inventory'

import * as Yup from 'yup'

class InventoryController {
  async store (ctx) {
    const schema = Yup.object().shape({
      name: Yup.string().required().min(1),
      description: Yup.string().min(10).max(100).required(),
      end_date: Yup.date()
    })

    if (!await schema.isValid(ctx.request.body)) {
      ctx.status = 400
      ctx.response.body = { error: 'Validation fails ' }
      return ctx.response.body
    }

    try {
      const inventory = await Inventory.create(ctx.request.body)
      ctx.status = 201
      ctx.response.body = { id: inventory.id, end_date: inventory.end_date }
      return
    } catch (e) {
      ctx.status = 400
      ctx.response.body = { error: 'Não foi possível inserir o item' }
    }
  }

  async update (ctx) {
    try {
      const inventory = await Inventory.findByPk(ctx.params.id)

      const { name, description, end_date } = await inventory.update(ctx.request.body)
      ctx.status = 200
      ctx.response.body = { name, description, end_date }
      return
    } catch (e) {
      ctx.status = 400
      ctx.response.body = { error: `Não foi atualizar os dados : ${e}` }
    }
  }
}

export default new InventoryController()
