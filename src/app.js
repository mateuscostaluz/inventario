import 'dotenv/config'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import routes from './routes'
import './database'

class App {
  constructor () {
    this.server = new Koa()

    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.server.use(bodyParser())
  }

  routes () {
    this.server.use(routes.routes())
  }
}

export default new App().server
