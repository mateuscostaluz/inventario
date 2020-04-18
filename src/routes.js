import Router from 'koa-routes'

import authMiddleware from './app/middlewares/auth'
import AuthController from './app/controllers/AuthController'
import ItemController from './app/controllers/ItemController'
import UserController from './app/controllers/UserController'
import InventoryController from './app/controllers/InventoryController'

const router = new Router()

router.get('/', ItemController.index)

router.post('/auth', AuthController.store)
router.post('/users', UserController.store)
router.post('/inventory', InventoryController.store)

// Todos os endpoints abaixo requerem autenticação
router.use(authMiddleware)
router.get('/users', UserController.index)
router.post('/item', ItemController.store)
router.put('/item/:id', ItemController.update)

export default router
