import Inventory from '../models/Inventory'

class InventoryController {
  async store (ctx) {
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
}

export default new InventoryController()
