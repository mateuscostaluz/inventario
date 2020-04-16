import Router from 'koa-routes'

import ItemController from './app/controllers/ItemController'

const router = new Router()

router.get('/', ItemController.index)
router.post('/item', ItemController.store)

export default router
