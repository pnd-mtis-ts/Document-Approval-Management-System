// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  transaksiDataValidator,
  transaksiPatchValidator,
  transaksiQueryValidator,
  transaksiResolver,
  transaksiExternalResolver,
  transaksiDataResolver,
  transaksiPatchResolver,
  transaksiQueryResolver
} from './transaksi.schema.js'
import { TransaksiService, getOptions } from './transaksi.class.js'
import { transaksiPath, transaksiMethods } from './transaksi.shared.js'

export * from './transaksi.class.js'
export * from './transaksi.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const transaksi = (app) => {
  // Register our service on the Feathers application
  app.use(transaksiPath, new TransaksiService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: transaksiMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(transaksiPath).hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(transaksiExternalResolver),
        schemaHooks.resolveResult(transaksiResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(transaksiQueryValidator),
        schemaHooks.resolveQuery(transaksiQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(transaksiDataValidator),
        schemaHooks.resolveData(transaksiDataResolver)
      ],
      patch: [
        schemaHooks.validateData(transaksiPatchValidator),
        schemaHooks.resolveData(transaksiPatchResolver)
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
