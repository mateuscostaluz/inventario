class ItemController {
  async index (req, res) {
    res.json({ ok: true })
  }
}

module.exports = new ItemController()
