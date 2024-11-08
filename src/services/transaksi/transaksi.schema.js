// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const transaksiSchema = {
  $id: 'Transaksi',
  type: 'object',
  additionalProperties: false,
  required: ['name','aplikasi_id'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    aplikasi_id: { type: 'number'}
  }
}
export const transaksiValidator = getValidator(transaksiSchema, dataValidator)
export const transaksiResolver = resolve({})

export const transaksiExternalResolver = resolve({})

// Schema for creating new data
export const transaksiDataSchema = {
  $id: 'TransaksiData',
  type: 'object',
  additionalProperties: false,
  required: ['name','aplikasi_id'],
  properties: {
    ...transaksiSchema.properties
  }
}
export const transaksiDataValidator = getValidator(transaksiDataSchema, dataValidator)
export const transaksiDataResolver = resolve({})

// Schema for updating existing data
export const transaksiPatchSchema = {
  $id: 'TransaksiPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...transaksiSchema.properties
  }
}
export const transaksiPatchValidator = getValidator(transaksiPatchSchema, dataValidator)
export const transaksiPatchResolver = resolve({})

// Schema for allowed query properties
export const transaksiQuerySchema = {
  $id: 'TransaksiQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(transaksiSchema.properties)
  }
}
export const transaksiQueryValidator = getValidator(transaksiQuerySchema, queryValidator)
export const transaksiQueryResolver = resolve({})
