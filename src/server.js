import app from './app'

const port = process.env.APP_PORT || 3333

export default app.listen(port, () => { console.log(`Servidor rodando na porta ${port}`) })
