import Inventory from '../models/Inventory'
import ItemInventory from '../models/ItemInventory'
import Item from '../models/Item'

import * as Yup from 'yup'
import User from '../models/User'

class InventoryController {
  async index (ctx) {
    const inventory = await Inventory.findAll({
      order: ['created_at'],
      attributes: ['id', 'name', 'end_date']
    })
    ctx.status = 200
    ctx.response.body = inventory
  }

  async findById (ctx) {
    const { id } = ctx.params
    const inventory = await Inventory.findByPk(id)
    const result = await ItemInventory.findAll(
      {
        where: {
          inventory_id: id
        },
        attributes: ['id', 'item_found_on_system', 'surplus'],
        include: [
          {
            model: Item,
            attributes: ['id', 'name']
          },
          {
            model: User,
            attributes: ['id', 'name']
          }
        ]
      }
    )
    ctx.status = 200
    ctx.response.body = {
      id: inventory.id,
      name: inventory.name,
      description: inventory.description,
      end_date: inventory.end_date,
      items: result
    }
  }

  async store (ctx) {
    const schema = Yup.object().shape({
      name: Yup.string().required().min(2).strict(),
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
    const schema = Yup.object().shape({
      name: Yup.string().min(2).strict(),
      description: Yup.string().min(10).max(100),
      end_date: Yup.date()
    })

    if (!await schema.isValid(ctx.request.body)) {
      ctx.status = 400
      ctx.response.body = { error: 'Parametros Inválidos' }
      return ctx.response.body
    }

    if (!await schema.isValid(ctx.request.body)) {
      ctx.status = 400
      ctx.response.body = { error: 'Parametros Inválidos' }
      return ctx.response.body
    }

    try {
      const inventory = await Inventory.findByPk(ctx.params.id)

      if (inventory.end_date) {
        ctx.status = 400
        ctx.response.body = { error: 'Impossível editar inventario, inventário já encerrado' }
        return ctx.response.body
      }

      const { name, description, end_date: endDate } = await inventory.update(ctx.request.body)
      ctx.status = 200
      ctx.response.body = { name, description, end_date: endDate }
      return
    } catch (e) {
      ctx.status = 400
      ctx.response.body = { error: `Não foi atualizar os dados : ${e}` }
    }
  }

  async delete (ctx) {
    const thereIsItemOnInventory = await ItemInventory.findOne({
      where: {
        inventory_id: ctx.params.id
      }
    })

    if (thereIsItemOnInventory) {
      ctx.status = 401
      ctx.response.body = { error: 'Não é possível apagar um inventario que contenha item' }
      return
    }

    try {
      const { id, name } = await Inventory.findByPk(ctx.params.id)

      await Inventory.destroy({
        where: {
          id: id
        }
      })
      ctx.status = 200
      ctx.response.body = {
        name,
        id
      }
    } catch (err) {
      ctx.status = 400
      ctx.response.body = { error: 'Erro ao deletar inventário' }
    }
  }
}

export default new InventoryController()
