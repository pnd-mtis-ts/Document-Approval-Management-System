import { jabatan } from './jabatan/jabatan.js'
import { users } from './users/users.js'
import { dokumen } from './dokumen/dokumen.js'
export const services = (app) => {
  app.configure(jabatan)

  app.configure(users), app.configure(dokumen)
}
