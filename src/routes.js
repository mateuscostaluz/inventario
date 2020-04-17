import Router from 'koa-routes'

import ItemController from './app/controllers/ItemController'
import UserController from './app/controllers/UserController'

const router = new Router()

router.get('/', ItemController.index)

router.post('/users', UserController.store)

router.post('/item', ItemController.store)
router.put('/item/:id', ItemController.update)

export default router
