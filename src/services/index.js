import { transaksi } from './transaksi/transaksi.js'
import { aplikasi } from './aplikasi/aplikasi.js'
import { signature } from './signature/signature.js'
import { company } from './company/company.js'
import { jabatan } from './jabatan/jabatan.js'
import { users } from './users/users.js'
import { dokumen } from './dokumen/dokumen.js'
export const services = (app) => {
  app.configure(transaksi)

  app.configure(aplikasi)

  app.configure(signature)

  app.configure(company)

  app.configure(jabatan)

  app.configure(users)
   
  app.configure(dokumen)
}
