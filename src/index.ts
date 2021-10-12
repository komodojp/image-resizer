import * as dotenv from 'dotenv'
import express from 'express'
import { Request } from 'express'
import morgan from 'morgan'
import { download } from './download'
import { transform } from './transform'

// load config
dotenv.config()
const settings = {
  host: process.env.STORAGE_HOST || 'http://google.com/',
  cache: process.env.CACHE ? parseInt(process.env.CACHE) : 60 * 5,
  port: process.env.PORT ? parseInt(process.env.PORT) : 8000
}

// create express server
const server = express()
server.use(morgan('dev'))
server.get('/*', async function (req: Request, res) {
  const imgPath = req.params[0]
  if (!imgPath || imgPath === 'favicon.ico') return res.status(404)
  try {
    const response = await download(`${settings.host}${imgPath}`)
    if (response.status !== 200) return res.status(404)
    res.set('Cache-control', `public, max-age=${settings.cache}`)
    response.data.pipe(transform(req.query, (type) => res.type(type))).pipe(res)
  } catch (err) {
    console.error(err)
    return res.status(500).send('Image not available')
  }
})

// start server
server.listen(settings.port, () =>
  console.log(`🚀 Image Resizer Server started! (http://localhost:${settings.port})`, settings)
)
