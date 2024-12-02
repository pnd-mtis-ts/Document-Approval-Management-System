// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const dokumenSchema = {
  $id: 'Dokumen',
  type: 'object',
  required: ['judul_dokumen', 'status', 'user_id'],
  properties: {
    id: { type: 'number' },
    judul_dokumen: { type: 'string' },
    status: { type: 'string' },
    user_id: { type: 'number' },
    user: { type: 'object' },
    version: { type: 'number'},
    nama_file: { type: 'string'}
  }
}
export const dokumenValidator = getValidator(dokumenSchema, dataValidator)
export const dokumenResolver = resolve({})

export const dokumenExternalResolver = resolve({})

// Schema for creating new data
export const dokumenDataSchema = {
  $id: 'DokumenData',
  type: 'object',
  additionalProperties: false,
  required: ['judul_dokumen', 'status'],
  properties: {
    ...dokumenSchema.properties
  }
}
export const dokumenDataValidator = getValidator(dokumenDataSchema, dataValidator)
export const dokumenDataResolver = resolve({})

// Schema for updating existing data
export const dokumenPatchSchema = {
  $id: 'DokumenPatch',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...dokumenSchema.properties
  }
}
export const dokumenPatchValidator = getValidator(dokumenPatchSchema, dataValidator)
export const dokumenPatchResolver = resolve({})

// Schema for allowed query properties
export const dokumenQuerySchema = {
  $id: 'DokumenQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(dokumenSchema.properties)
  }
}
export const dokumenQueryValidator = getValidator(dokumenQuerySchema, queryValidator)
export const dokumenQueryResolver = resolve({})
