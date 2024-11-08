import { authenticate } from '@feathersjs/authentication'
import { DokumenService, getOptions } from './dokumen.class.js'
import multer from 'multer'
import path from 'path'

import { dokumenResolver } from './dokumen.schema.js'
// Fix the schema hooks import
import hooks from '@feathersjs/schema'

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

export const dokumenPath = 'dokumen'
export const dokumenMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './dokumen.class.js'

export const dokumen = (app) => {
  const options = getOptions(app)
  // Use Koa middleware for file uploads
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
      console.log('Request Body:', ctx.req.body)
      console.log('Uploaded File:', ctx.req.file)
      if (ctx.req.file) {
        ctx.req.body.file_url = ctx.req.file.path
      }
      ctx.feathers = { req: ctx.req }
    }
    await next()
  })

  // Register the service
  app.use(dokumenPath, new DokumenService(options), {
    methods: dokumenMethods,
    events: []
  })

  // Get the service to apply hooks
  const service = app.service(dokumenPath)

  service.hooks({
    around: {
      all: [authenticate('jwt')],
      find: [hooks.resolveResult(dokumenResolver)],
      get: [hooks.resolveResult(dokumenResolver)]
    },
    before: {
      create: [
        async (context) => {
          const { req } = context.params
          if (!req) {
            throw new Error('Request object is missing')
          }

          // Assign context.data from req.body
          context.data = req.body

          console.log('Raw request:', req.body)
          console.log('File:', req.file)

          if (!context.data.judul_dokumen) {
            throw new Error('Judul dokumen harus diisi')
          }

          // Add additional data
          context.data = {
            ...context.data,
            user_id: context.params.user.id,
            status: 'pending'
          }

          if (req.file) {
            context.data.file_url = req.file.path
          }

          console.log('Final data:', context.data)

          return context
        }
      ]
    },
    after: {
      // No after hooks needed since we're using resolvers
    }
  })
}
