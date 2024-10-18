// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const usersSchema = {
  $id: 'Users',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'email'], //, 'password', 'role'
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },           
    email: { type: 'string' },          
    password: { type: 'string' },
    role: { type: 'string', enum: ['SuperAdmin', 'Admin', 'User','Aplikasi'] },
    googleId: { type: 'string' },
    sub: { type: 'string' },
    jabatan: {type: 'string'}, //object usersprofile
    pin: {type: 'string'} 
  }
}
export const usersValidator = getValidator(usersSchema, dataValidator)
export const usersResolver = resolve({})
export const usersExternalResolver = resolve({})

// Schema for creating new data
export const usersDataSchema = {
  $id: 'UsersData',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'email'], //, 'password', 'role'
  properties: {
    ...usersSchema.properties
  }
}
export const usersDataValidator = getValidator(usersDataSchema, dataValidator)
export const usersDataResolver = resolve({})

// Schema for updating existing data
export const usersPatchSchema = {
  $id: 'UsersPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...usersSchema.properties
  }
}
export const usersPatchValidator = getValidator(usersPatchSchema, dataValidator)
export const usersPatchResolver = resolve({})

// Schema for allowed query properties
export const usersQuerySchema = {
  $id: 'UsersQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(usersSchema.properties)
  }
}
export const usersQueryValidator = getValidator(usersQuerySchema, queryValidator)
export const usersQueryResolver = resolve({})
