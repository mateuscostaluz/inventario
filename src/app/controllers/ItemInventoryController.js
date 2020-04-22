import Inventory from '../models/Inventory'
import Item from '../models/Item'
import ItemInventory from '../models/ItemInventory'

class ItemInventoryController {
  async store (ctx) {
    const { userId } = ctx.request
    const { inventory_id: invId, item_id: itemId } = ctx.request.body

    const item = await Item.findByPk(itemId)
    const inventory = await Inventory.findByPk(invId)

    if (!(invId && itemId)) {
      ctx.status = 400
      ctx.response.body = { error: 'Parametros Inválidos' }
      return
    }

    if (inventory.end_date !== null) {
      ctx.status = 400
      ctx.response.body = { error: 'Inventário já está fechado' }
      return
    }

    if (!item) {
      ctx.status = 400
      ctx.response.body = { error: 'Item não encontrado' }
      return
    }

    const itemFoundOnSystem = item.department_id === inventory.department_id

    // surplus significa 'bem excedente'
    const surplus = !itemFoundOnSystem

    const itemInventory = await ItemInventory.create(
      {
        inventory_id: invId,
        item_id: itemId,
        user_id: userId,
        item_found_on_system: itemFoundOnSystem,
        surplus
      })

    ctx.status = 201
    ctx.response.body = itemInventory
  }
}

export default new ItemInventoryController()
