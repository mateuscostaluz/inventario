class ItemController {
  async index (ctx) {
    ctx.response.body = ({ ok: true })
  }
}

export default new ItemController()
