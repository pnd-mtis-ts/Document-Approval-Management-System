// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Perbarui skema utama pengguna
export const usersSchema = {
  $id: 'Users',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'email'], // Tambahkan field wajib lainnya jika diperlukan
  properties: {
    id: { type: 'number' },
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    role: { type: 'string', enum: ['SuperAdmin', 'Admin', 'User', 'Aplikasi'] },
    googleId: { type: 'string' },
    sub: { type: 'string' },
    alamat: { type: 'string' },
    nomor_telepon: { type: 'string' },
    pin: { type: 'string' },
    // Hapus company_id, jabatan_id, dan aplikasi_id dari sini
    // Pertahankan company, jabatan, dan aplikasi sebagai string
    company: { type: 'string' },
    jabatan: { type: 'string' },
    aplikasi: { type: 'string' }
  }
}
export const usersValidator = getValidator(usersSchema, dataValidator)
export const usersResolver = resolve({})
export const usersExternalResolver = resolve({})

// Tambahkan field baru ke dalam skema data
export const usersDataSchema = {
  $id: 'UsersData',
  type: 'object',
  additionalProperties: false,
  required: ['name', 'email'],
  properties: {
    ...usersSchema.properties
  }
}
export const usersDataValidator = getValidator(usersDataSchema, dataValidator)
export const usersDataResolver = resolve({
  company_id: async (value) => parseInt(value),
  jabatan_id: async (value) => parseInt(value),
  aplikasi_id: async (value) => parseInt(value)
})

// Skema untuk pembaruan data
export const usersPatchSchema = {
  $id: 'UsersPatch',
  type: 'object',
  additionalProperties: false,
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
