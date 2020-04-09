const { Router } = require('express')
const router = new Router()

const itemController = require('./app/controllers/ItemController')

router.get('/items', itemController.index)

module.exports = router
