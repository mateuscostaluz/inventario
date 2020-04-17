import Router from 'koa-routes'

import authMiddleware from './app/middlewares/auth'
import AuthController from './app/controllers/AuthController'
import ItemController from './app/controllers/ItemController'
import UserController from './app/controllers/UserController'

const router = new Router()

router.get('/', ItemController.index)

router.post('/auth', AuthController.store)
router.post('/users', UserController.store)

// Todos os endpoints abaixo requerem autenticação
router.use(authMiddleware)
router.get('/users', UserController.index)
router.put('/users', UserController.update)
router.post('/item', ItemController.store)
router.put('/item/:id', ItemController.update)

export default router
