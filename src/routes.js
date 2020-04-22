import Router from 'koa-routes'

import authMiddleware from './app/middlewares/auth'
import AuthController from './app/controllers/AuthController'
import ItemController from './app/controllers/ItemController'
import ItemInventoryController from './app/controllers/ItemInventoryController'
import UserController from './app/controllers/UserController'
import InventoryController from './app/controllers/InventoryController'
import DepartmentController from './app/controllers/DepartmentController'

const router = new Router()

router.post('/auth', AuthController.store)
router.post('/users', UserController.store)

// Todos os endpoints abaixo requerem autenticação
router.use(authMiddleware)

router.get('/users', UserController.index)
router.put('/users', UserController.update)
router.delete('/users', UserController.delete)

router.post('/item', ItemController.store)
router.get('/item/:id', ItemController.findById)
router.put('/item/:id', ItemController.update)

router.post('/department', DepartmentController.store)
router.put('/department/:id', DepartmentController.update)

router.post('/inventory', InventoryController.store)
router.put('/inventory/:id', InventoryController.update)

router.post('/iteminventory', ItemInventoryController.store)

export default router
