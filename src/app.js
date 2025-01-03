// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import { configurationValidator } from './configuration.js'
import { logger } from './logger.js'
import { logError } from './hooks/log-error.js'
import { mysql } from './mysql.js'
import { authentication } from './authentication.js'
import { services } from './services/index.js'
import { channels } from './channels.js'
import multer from 'multer'
import path from 'path'

const app = koa(feathers())

app.configure(configuration(configurationValidator))

app.use(
  cors({
    credentials: true
  })
)
app.use(serveStatic(app.get('public')))
app.use(serveStatic(app.get('uploads')))
app.use(errorHandler({ logger }))
app.use(parseAuthentication())
app.use(bodyParser())

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: async (req, file, cb) => {
    try {
      const knex = app.get('mysqlClient')
      const nomorDokumen = req.body.nomor_dokumen

      // Get current max version
      const maxVersionResult = await knex('dokumenversion')
        .join('dokumen', 'dokumenversion.dokumen_id', 'dokumen.id')
        .where('dokumen.nomor_dokumen', nomorDokumen)
        .max('version as maxVersion')
        .first()

      const currentVersion = (maxVersionResult?.maxVersion || 0) + 1
      const baseName = path.parse(file.originalname).name
      const ext = path.extname(file.originalname)
      const newFilename = `${nomorDokumen}-${baseName}_versi_${currentVersion}${ext}`
      cb(null, newFilename)
    } catch (error) {
      cb(error)
    }
  }
})
const upload = multer({ storage: storage })

app.use(async (ctx, next) => {
  if (ctx.path === '/dokumen' && ctx.method === 'POST') {
    await new Promise((resolve, reject) => {
      upload.single('file_dokumen')(ctx.req, ctx.res, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
    const requestBody = Object.assign({}, ctx.req.body)
    ctx.req.body = requestBody
    console.log('Uploaded File:', ctx.req.file)
    if (ctx.req.file) {
      ctx.req.body.file_url = ctx.req.file.path
      ctx.req.body.nama_file = ctx.req.file.originalname
      ctx.req.body.tipe_file = ctx.req.file.mimetype
      ctx.req.body.size_file = ctx.req.file.size
      ctx.req.body.nama_file_multer = ctx.req.file.filename
    }
    ctx.feathers = { req: ctx.req }
  }
  await next()
})

app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(mysql)
app.configure(authentication)
app.configure(services)
app.configure(channels)

app.use(async (ctx, next) => {
  await next()
  if (ctx.status === 404) {
    ctx.body = { error: 'Not Found' }
  }
})

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})

// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
