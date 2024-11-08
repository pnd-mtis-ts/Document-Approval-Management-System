// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  aplikasiDataValidator,
  aplikasiPatchValidator,
  aplikasiQueryValidator,
  aplikasiResolver,
  aplikasiExternalResolver,
  aplikasiDataResolver,
  aplikasiPatchResolver,
  aplikasiQueryResolver
} from './aplikasi.schema.js'
import { AplikasiService, getOptions } from './aplikasi.class.js'
import { aplikasiPath, aplikasiMethods } from './aplikasi.shared.js'

export * from './aplikasi.class.js'
export * from './aplikasi.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const aplikasi = (app) => {
  // Register our service on the Feathers application
  app.use(aplikasiPath, new AplikasiService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: aplikasiMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(aplikasiPath).hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(aplikasiExternalResolver),
        schemaHooks.resolveResult(aplikasiResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(aplikasiQueryValidator),
        schemaHooks.resolveQuery(aplikasiQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(aplikasiDataValidator),
        schemaHooks.resolveData(aplikasiDataResolver)
      ],
      patch: [
        schemaHooks.validateData(aplikasiPatchValidator),
        schemaHooks.resolveData(aplikasiPatchResolver)
      ],
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
