import Router from 'koa-routes'

import ItemController from './app/controllers/ItemController'

const router = new Router()

router.get('/', ItemController.index)

export default router
