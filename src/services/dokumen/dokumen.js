import { authenticate } from '@feathersjs/authentication'
import { DokumenService, getOptions } from './dokumen.class.js'
import { dokumenResolver } from './dokumen.schema.js'
import hooks from '@feathersjs/schema'
import { dokumenPath, dokumenMethods } from './dokumen.shared.js'

export * from './dokumen.class.js'

export const dokumen = (app) => {
  const options = getOptions(app)
  
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
            context.data.nama_file = req.file.originalname
            context.data.tipe_file = req.file.mimetype
            context.data.size_file = req.file.size
            context.data.nama_file_multer = req.file.filename
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
