import { KnexService } from '@feathersjs/knex'
import bcrypt from 'bcrypt'
import { BadRequest } from '@feathersjs/errors'

export class UsersService extends KnexService {
  constructor(options) {
    super(options)
    this.knex = options.Model
  }

  async create(data, params) {
    const { alamat, nomor_telepon, role, company, jabatan, aplikasi, ...userData } = data

    // Check if user already exists
    const existingUser = await this.find({
      query: { email: userData.email }
    })

    if (existingUser.total > 0) {
      throw new BadRequest('User with this email already exists.')
    }

    // Generate unique username
    const baseName = userData.name
    let nameWithSuffix = baseName
    let count = 1

    while ((await this.find({ query: { name: nameWithSuffix } }).total) > 0) {
      nameWithSuffix = `${baseName}${count}`
      count++
    }

    userData.name = nameWithSuffix

    const trx = await this.knex.transaction()

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10)

      // Insert ke tabel 'users' (tanpa alamat dan nomor_telepon)
      const [newUserId] = await trx('users').insert({
        name: data.name,
        email: data.email,
        password: hashedPassword
      })

      // Insert ke tabel 'usersprofile'
      await trx('usersprofile').insert({
        user_id: newUserId,
        alamat: data.alamat,
        nomor_telepon: data.nomor_telepon
      })

      // Handle role
      let roleId
      const existingRole = await trx('usersrole').where({ name: data.role }).first()
      if (existingRole) {
        roleId = existingRole.id
      } else {
        const [insertedId] = await trx('usersrole').insert({ name: data.role })
        roleId = insertedId
      }

      // Handle company
      let companyId
      const existingCompany = await trx('company').where({ name: data.company }).first()
      if (existingCompany) {
        companyId = existingCompany.id
      } else {
        const [insertedId] = await trx('company').insert({ name: data.company })
        companyId = insertedId
      }

      // Handle jabatan
      let jabatanId
      const existingJabatan = await trx('jabatan').where({ nama_jabatan: data.jabatan }).first()
      if (existingJabatan) {
        jabatanId = existingJabatan.id
      } else {
        const [insertedId] = await trx('jabatan').insert({ nama_jabatan: data.jabatan })
        jabatanId = insertedId
      }

      // Handle aplikasi
      let aplikasiId
      const existingAplikasi = await trx('aplikasi').where({ name: data.aplikasi }).first()
      if (existingAplikasi) {
        aplikasiId = existingAplikasi.id
      } else {
        const [insertedId] = await trx('aplikasi').insert({ name: data.aplikasi })
        aplikasiId = insertedId
      }

      // Insert ke tabel 'usersauth' dengan company_id, jabatan_id, aplikasi_id
      await trx('usersauth').insert({
        user_id: newUserId,
        role_id: roleId,
        company_id: companyId,
        jabatan_id: jabatanId,
        aplikasi_id: aplikasiId
      })

      // After all inserts are complete, create the response object with IDs
      const responseData = {
        id: newUserId,
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        alamat: data.alamat,
        nomor_telepon: data.nomor_telepon,
        company: data.company,
        aplikasi: data.aplikasi,
        jabatan: data.jabatan,
        company_id: companyId, // Add the IDs to response
        jabatan_id: jabatanId,
        aplikasi_id: aplikasiId
      }

      // Commit transaksi
      await trx.commit()

      // Kembalikan data pengguna baru
      return responseData // Return the complete object
    } catch (error) {
      // Rollback transaksi jika ada error
      await trx.rollback()
      throw error
    }
  }

  async find(params) {
    const users = await super.find(params)

    for (let user of users.data) {
      // Get userProfile with role and jabatan
      user.userProfile = await this.knex('usersprofile')
        .select('usersprofile.*', 'usersrole.name as role', 'jabatan.nama_jabatan as jabatan')
        .where({ 'usersprofile.user_id': user.id })
        .leftJoin('usersauth', 'usersprofile.user_id', 'usersauth.user_id')
        .leftJoin('usersrole', 'usersauth.role_id', 'usersrole.id')
        .leftJoin('jabatan', 'usersauth.jabatan_id', 'jabatan.id')
        .first()

      user.userAuth = await this.knex('usersauth')
        .select('usersauth.*')
        .where({ 'usersauth.user_id': user.id })
        .first()
    }

    return users
  }

  async get(id, params) {
    const user = await super.get(id, params)

    // Get userProfile with role and jabatan
    user.userProfile = await this.knex('usersprofile')
      .select('usersprofile.*', 'usersrole.name as role', 'jabatan.nama_jabatan as jabatan')
      .where({ 'usersprofile.user_id': id })
      .leftJoin('usersauth', 'usersprofile.user_id', 'usersauth.user_id')
      .leftJoin('usersrole', 'usersauth.role_id', 'usersrole.id')
      .leftJoin('jabatan', 'usersauth.jabatan_id', 'jabatan.id')
      .first()

    // Get userAuth without role and jabatan
    user.userAuth = await this.knex('usersauth')
      .select('usersauth.*')
      .where({ 'usersauth.user_id': id })
      .first()

    return user
  }

  async patch(id, data, params) {
    const { alamat, nomor_telepon, role, company, jabatan, aplikasi, ...userData } = data

    // Start a transaction
    const trx = await this.knex.transaction()

    try {
      // Update user data
      await trx('users').where({ id }).update(userData)

      const existingProfile = await trx('usersprofile').where({ user_id: id }).first()
      if (existingProfile) {
        await trx('usersprofile').where({ user_id: id }).update({ alamat, nomor_telepon })
      } else {
        await trx('usersprofile').insert({ user_id: id, alamat, nomor_telepon })
      }

      if (role !== undefined) {
        let roleId
        const existingRole = await trx('usersrole').where({ name: role }).first()
        if (existingRole) {
          roleId = existingRole.id
        } else {
          ;[roleId] = await trx('usersrole').insert({ name: role })
        }

        const existingAuth = await trx('usersauth').where({ user_id: id }).first()
        if (existingAuth) {
          await trx('usersauth').where({ user_id: id }).update({ role_id: roleId })
        } else {
          await trx('usersauth').insert({ user_id: id, role_id: roleId })
        }
      }

      // Handle company_id
      let companyId
      const existingCompany = await trx('company').where({ name: company }).first()
      if (existingCompany) {
        companyId = existingCompany.id
      } else {
        ;[companyId] = await trx('company').insert({ name: company })
      }

      // Handle jabatan_id
      let jabatanId
      const existingJabatan = await trx('jabatan').where({ nama_jabatan: jabatan }).first()
      if (existingJabatan) {
        jabatanId = existingJabatan.id
      } else {
        ;[jabatanId] = await trx('jabatan').insert({ nama_jabatan: jabatan })
      }

      // Handle aplikasi_id
      let aplikasiId
      const existingAplikasi = await trx('aplikasi').where({ name: aplikasi }).first()
      if (existingAplikasi) {
        aplikasiId = existingAplikasi.id
      } else {
        ;[aplikasiId] = await trx('aplikasi').insert({ name: aplikasi })
      }

      // Update user auth entry
      const existingAuth = await trx('usersauth').where({ user_id: id }).first()
      if (existingAuth) {
        await trx('usersauth').where({ user_id: id }).update({
          role_id: roleId,
          company_id: companyId,
          jabatan_id: jabatanId,
          aplikasi_id: aplikasiId
        })
      } else {
        await trx('usersauth').insert({
          user_id: id,
          role_id: roleId,
          company_id: companyId,
          jabatan_id: jabatanId,
          aplikasi_id: aplikasiId
        })
      }

      // Commit the transaction
      await trx.commit()

      // Fetch and return the updated user with profile and auth
      return this.get(id, params)
    } catch (error) {
      // If anything goes wrong, roll back the transaction
      await trx.rollback()
      throw error
    }
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'users'
  }
}
