// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const jabatanSchema = {
  $id: 'Jabatan',
  type: 'object',
  additionalProperties: false,
  required: ['nama_jabatan'],
  properties: {
    id: { type: 'number' },
    nama_jabatan: { type: 'string' },
    user_id: { type: 'number'}
  }
}
export const jabatanValidator = getValidator(jabatanSchema, dataValidator)
export const jabatanResolver = resolve({})

export const jabatanExternalResolver = resolve({})

// Schema for creating new data
export const jabatanDataSchema = {
  $id: 'JabatanData',
  type: 'object',
  additionalProperties: false,
  required: ['nama_jabatan'],
  properties: {
    ...jabatanSchema.properties
  }
}
export const jabatanDataValidator = getValidator(jabatanDataSchema, dataValidator)
export const jabatanDataResolver = resolve({})

// Schema for updating existing data
export const jabatanPatchSchema = {
  $id: 'JabatanPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...jabatanSchema.properties
  }
}
export const jabatanPatchValidator = getValidator(jabatanPatchSchema, dataValidator)
export const jabatanPatchResolver = resolve({})

// Schema for allowed query properties
export const jabatanQuerySchema = {
  $id: 'JabatanQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(jabatanSchema.properties)
  }
}
export const jabatanQueryValidator = getValidator(jabatanQuerySchema, queryValidator)
export const jabatanQueryResolver = resolve({})
