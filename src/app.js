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

// Load app configuration
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(
  cors({
    // Adjust the origin as per your client application
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
  filename: (req, file, cb) => {
    const idMulter = `${Date.now()}${Math.floor(Math.random() * 10)}`
    const baseName = path.parse(file.originalname).name
    const ext = path.extname(file.originalname)
    const prefixedNamaFile = `${idMulter}-${baseName}${ext}`
    cb(null, prefixedNamaFile)
  }
})

const upload = multer({ storage: storage })

// Koa middleware to handle file uploads
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
    // Convert prototype-less object to regular object
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
    // Attach req to context.params
    ctx.feathers = { req: ctx.req }
  }
  await next()
})

// Configure services and real-time functionality
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

// Configure a middleware for 404s and the error handler
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
