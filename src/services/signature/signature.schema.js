// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const signatureSchema = {
  $id: 'Signature',
  type: 'object',
  additionalProperties: false,
  required: ['file_signature','user_id'],
  properties: {
    id: { type: 'number' },
    file_signature: { type: 'string' },
    user_id: { type: 'number'}
  }
}
export const signatureValidator = getValidator(signatureSchema, dataValidator)
export const signatureResolver = resolve({})

export const signatureExternalResolver = resolve({})

// Schema for creating new data
export const signatureDataSchema = {
  $id: 'SignatureData',
  type: 'object',
  additionalProperties: false,
  required: ['file_signature','user_id'],
  properties: {
    ...signatureSchema.properties
  }
}
export const signatureDataValidator = getValidator(signatureDataSchema, dataValidator)
export const signatureDataResolver = resolve({})

// Schema for updating existing data
export const signaturePatchSchema = {
  $id: 'SignaturePatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...signatureSchema.properties
  }
}
export const signaturePatchValidator = getValidator(signaturePatchSchema, dataValidator)
export const signaturePatchResolver = resolve({})

// Schema for allowed query properties
export const signatureQuerySchema = {
  $id: 'SignatureQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(signatureSchema.properties)
  }
}
export const signatureQueryValidator = getValidator(signatureQuerySchema, queryValidator)
export const signatureQueryResolver = resolve({})
