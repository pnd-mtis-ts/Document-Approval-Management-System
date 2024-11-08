// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const aplikasiSchema = {
  $id: 'Aplikasi',
  type: 'object',
  additionalProperties: false,
  required: ['name','company_id'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    company_id: { type: 'number'},
    user_id: { type: 'number'}
  }
}
export const aplikasiValidator = getValidator(aplikasiSchema, dataValidator)
export const aplikasiResolver = resolve({})

export const aplikasiExternalResolver = resolve({})

// Schema for creating new data
export const aplikasiDataSchema = {
  $id: 'AplikasiData',
  type: 'object',
  additionalProperties: false,
  required: ['name','company_id','user_id'],
  properties: {
    ...aplikasiSchema.properties
  }
}
export const aplikasiDataValidator = getValidator(aplikasiDataSchema, dataValidator)
export const aplikasiDataResolver = resolve({})

// Schema for updating existing data
export const aplikasiPatchSchema = {
  $id: 'AplikasiPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...aplikasiSchema.properties
  }
}
export const aplikasiPatchValidator = getValidator(aplikasiPatchSchema, dataValidator)
export const aplikasiPatchResolver = resolve({})

// Schema for allowed query properties
export const aplikasiQuerySchema = {
  $id: 'AplikasiQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(aplikasiSchema.properties)
  }
}
export const aplikasiQueryValidator = getValidator(aplikasiQuerySchema, queryValidator)
export const aplikasiQueryResolver = resolve({})
