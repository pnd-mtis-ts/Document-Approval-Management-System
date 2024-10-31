// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  jabatanDataValidator,
  jabatanPatchValidator,
  jabatanQueryValidator,
  jabatanResolver,
  jabatanExternalResolver,
  jabatanDataResolver,
  jabatanPatchResolver,
  jabatanQueryResolver
} from './jabatan.schema.js'
import { JabatanService, getOptions } from './jabatan.class.js'
import { jabatanPath, jabatanMethods } from './jabatan.shared.js'

export * from './jabatan.class.js'
export * from './jabatan.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const jabatan = (app) => {
  // Register our service on the Feathers application
  app.use(jabatanPath, new JabatanService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: jabatanMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(jabatanPath).hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(jabatanExternalResolver),
        schemaHooks.resolveResult(jabatanResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(jabatanQueryValidator), schemaHooks.resolveQuery(jabatanQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(jabatanDataValidator), schemaHooks.resolveData(jabatanDataResolver)],
      patch: [schemaHooks.validateData(jabatanPatchValidator), schemaHooks.resolveData(jabatanPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
