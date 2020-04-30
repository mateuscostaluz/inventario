import Router from 'koa-routes'
import yamljs from 'yamljs'
import koaSwagger from 'koa2-swagger-ui'

import authMiddleware from './app/middlewares/auth'
import AuthController from './app/controllers/AuthController'
import ItemController from './app/controllers/ItemController'
import ItemInventoryController from './app/controllers/ItemInventoryController'
import UserController from './app/controllers/UserController'
import InventoryController from './app/controllers/InventoryController'
import DepartmentController from './app/controllers/DepartmentController'

const router = new Router()

const spec = yamljs.load('./src/docs/swagger.yaml')

router.use(koaSwagger())
router.get('/docs', koaSwagger({ routePrefix: false, swaggerOptions: { spec } }))

router.post('/auth', AuthController.store)
router.post('/users', UserController.store)

// Todos os endpoints abaixo requerem autenticação
router.use(authMiddleware)
router.use('/')

router.get('/users', UserController.index)
router.put('/users', UserController.update)
router.delete('/users', UserController.delete)

router.post('/item', ItemController.store)
router.get('/item/:id', ItemController.findById)
router.put('/item/:id', ItemController.update)
router.delete('/item/:id', ItemController.delete)

router.post('/department', DepartmentController.store)
router.get('/department/:id', DepartmentController.findById)
router.put('/department/:id', DepartmentController.update)
router.delete('/department/:id', DepartmentController.delete)

router.get('/inventory/:id', InventoryController.findById)
router.post('/inventory', InventoryController.store)
router.get('/inventory', InventoryController.index)
router.put('/inventory/:id', InventoryController.update)
router.delete('/inventory/:id', InventoryController.delete)

router.post('/iteminventory', ItemInventoryController.store)
router.delete('/iteminventory/:itemId/:inventoryId', ItemInventoryController.delete)

export default router
