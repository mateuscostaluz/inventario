import Department from '../models/Department'
import Inventory from '../models/Inventory'
import Item from '../models/Item'
import ItemInventory from '../models/ItemInventory'

class ItemInventoryController {
  async store (ctx) {
    const { userId } = ctx.request
    const { inventory_id, item_id, department_id } = ctx.request.body

    const item = await Item.findByPk(item_id)
    const inventory = await Inventory.findByPk(inventory_id)
    const department = await Department.findByPk(department_id)

    if (!(inventory_id && item_id && department_id)) {
      ctx.status = 400
      ctx.response.body = { error: 'Invalid Parameters' }
      return
    }

    /**
     * Se o item for encontrado preencher o campo: Item Encontrado = SIM
     * TODO: Dúvida: Se o item for encontrado onde?
     * Em todos os itens do sistema OU nos itens que
     * já estão cadastrados neste ou em outro inventário já feito?
    **/
    const item_found_on_system = !!item

    /**
     * Se o item não for encontrado nessa lista (qual lista?), porém existe no sistema
     * (Ou seja é um ativo fixo que foi registrado no sistema, porém de outro setor).
     * Deve chamar a função de adicionar nova linha e preencher com o item encontrado,
     * marcando o flag padrão de bem excedente (processo igual se fosse criado manualmente)
     */
    // surplus significa 'bem excedente'
    const surplus = item.department_id !== department_id

    /**
     * Se o item não for encontrado nessa lista (qual lista?) e nem no sistema.
     * Exibir mensagem de erro: "Item não localizado no sistema"
     * e Preencher o campo Item Encontrado = NÃO
     */

    // TODO: concluir implementação do endpoint
  }
}

export default new ItemInventoryController()
