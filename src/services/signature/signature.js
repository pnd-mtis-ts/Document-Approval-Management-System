// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  signatureDataValidator,
  signaturePatchValidator,
  signatureQueryValidator,
  signatureResolver,
  signatureExternalResolver,
  signatureDataResolver,
  signaturePatchResolver,
  signatureQueryResolver
} from './signature.schema.js'
import { SignatureService, getOptions } from './signature.class.js'
import { signaturePath, signatureMethods } from './signature.shared.js'

export * from './signature.class.js'
export * from './signature.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const signature = (app) => {
  // Register our service on the Feathers application
  app.use(signaturePath, new SignatureService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: signatureMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(signaturePath).hooks({
    around: {
      all: [
        // authenticate('jwt'),
        schemaHooks.resolveExternal(signatureExternalResolver),
        schemaHooks.resolveResult(signatureResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(signatureQueryValidator),
        schemaHooks.resolveQuery(signatureQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(signatureDataValidator),
        schemaHooks.resolveData(signatureDataResolver)
      ],
      patch: [
        schemaHooks.validateData(signaturePatchValidator),
        schemaHooks.resolveData(signaturePatchResolver)
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
