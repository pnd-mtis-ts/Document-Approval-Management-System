// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const companySchema = {
  $id: 'Company',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'address' ,'no_phone', 'user_id'],
  properties: {
    id: { type: 'number' },
    name: { type: 'string'},
    address: { type: 'string'},
    no_phone: { type: 'number'},
    user_id: { type: 'number'}
  }
}
export const companyValidator = getValidator(companySchema, dataValidator)
export const companyResolver = resolve({})

export const companyExternalResolver = resolve({})

// Schema for creating new data
export const companyDataSchema = {
  $id: 'CompanyData',
  type: 'object',
  additionalProperties: false,
  required: ['name','address','no_phone', 'user_id'],
  properties: {
    ...companySchema.properties
  }
}
export const companyDataValidator = getValidator(companyDataSchema, dataValidator)
export const companyDataResolver = resolve({})

// Schema for updating existing data
export const companyPatchSchema = {
  $id: 'CompanyPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...companySchema.properties
  }
}
export const companyPatchValidator = getValidator(companyPatchSchema, dataValidator)
export const companyPatchResolver = resolve({})

// Schema for allowed query properties
export const companyQuerySchema = {
  $id: 'CompanyQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(companySchema.properties)
  }
}
export const companyQueryValidator = getValidator(companyQuerySchema, queryValidator)
export const companyQueryResolver = resolve({})
