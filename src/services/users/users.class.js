import { KnexService } from '@feathersjs/knex'
import bcrypt from 'bcrypt'
import { BadRequest } from '@feathersjs/errors'

export class UsersService extends KnexService {
  constructor(options) {
    super(options)
    this.knex = options.Model
  }

  async create(data, params) {
    const { alamat, nomor_telepon, authDataArray, password, ...userData } = data

    const trx = await this.knex.transaction()

    try {
      // Check existing user
      const existingUser = await this.find({
        query: { email: userData.email },
        paginate: false
      })

      if (existingUser.length > 0) {
        throw new BadRequest('User dengan email ini sudah terdaftar.')
      }

      // Create new user
      const [newUserId] = await trx('users').insert({
        name: userData.name,
        email: userData.email,
        password: await bcrypt.hash(password, 10),
        pin: data.pin
      })

      // Create user profile
      await trx('usersprofile').insert({
        user_id: newUserId,
        alamat,
        nomor_telepon
      })

      // Handle auth data
      if (Array.isArray(authDataArray)) {
        for (const authData of authDataArray) {
          const { role, company, jabatan, aplikasi } = authData

          // Handle role
          let roleId
          const existingRole = await trx('usersrole').where({ name: role }).first()
          if (existingRole) {
            roleId = existingRole.id
          } else {
            throw new BadRequest(`Role ${role} tidak ditemukan.`)
          }

          // Handle company
          let companyId
          const existingCompany = await trx('company').where({ id: company }).first()
          if (existingCompany) {
            companyId = existingCompany.id
          } else {
            throw new BadRequest(`Company dengan ID ${company} tidak ditemukan.`)
          }

          // Handle jabatan
          let jabatanId
          const existingJabatan = await trx('jabatan').where({ id: jabatan }).first()
          if (existingJabatan) {
            jabatanId = existingJabatan.id
          } else {
            throw new BadRequest(`Jabatan dengan ID ${jabatan} tidak ditemukan.`)
          }

          // Handle aplikasi
          let aplikasiId
          const existingAplikasi = await trx('aplikasi').where({ id: aplikasi }).first()
          if (existingAplikasi) {
            aplikasiId = existingAplikasi.id
          } else {
            throw new BadRequest(`Aplikasi dengan ID ${aplikasi} tidak ditemukan.`)
          }

          // Insert into usersauth
          await trx('usersauth').insert({
            user_id: newUserId,
            role_id: roleId,
            company_id: companyId,
            jabatan_id: jabatanId,
            aplikasi_id: aplikasiId
          })
        }
      }

      await trx.commit()

      return {
        id: newUserId,
        name: userData.name,
        email: userData.email,
        alamat,
        nomor_telepon
      }
    } catch (error) {
      console.error('Error creating user:', error)
      await trx.rollback()
      throw error
    }
  }

  // Add new method for authorization setup
  async setupAuthorization(userId, authData) {
    const { role, company, jabatan, aplikasi } = authData
    const trx = await this.knex.transaction()

    try {
      // Handle role, company, jabatan, aplikasi creation/lookup
      // ... (keep existing auth logic)

      await trx.commit()
      return this.get(userId)
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  // users.class.js - Updated find method

  async find(params) {
    const users = await super.find(params)

    // Handle both paginated and non-paginated responses
    const items = users.data ? users.data : users

    // Process each user
    const processedUsers = await Promise.all(
      items.map(async (user) => {
        // Get userProfile with role and jabatan
        user.userProfile = await this.knex('usersprofile')
          .select('usersprofile.*', 'usersrole.name as role', 'jabatan.nama_jabatan as jabatan')
          .where({ 'usersprofile.user_id': user.id })
          .leftJoin('usersauth', 'usersprofile.user_id', 'usersauth.user_id')
          .leftJoin('usersrole', 'usersauth.role_id', 'usersrole.id')
          .leftJoin('jabatan', 'usersauth.jabatan_id', 'jabatan.id')
          .first()

        // Get userAuth
        user.userAuth = await this.knex('usersauth')
          .select('usersauth.*')
          .where({ 'usersauth.user_id': user.id })
          .first()

        return user
      })
    )

    // Return in the correct format
    if (users.data) {
      return {
        ...users,
        data: processedUsers
      }
    }

    return processedUsers
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
          throw new BadRequest(`Role ${role} tidak ditemukan.`)
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
      const existingCompany = await trx('company').where({ id: company }).first()
      if (existingCompany) {
        companyId = existingCompany.id
      } else {
        throw new BadRequest(`Company dengan ID ${company} tidak ditemukan.`)
      }

      // Handle jabatan_id
      let jabatanId
      const existingJabatan = await trx('jabatan').where({ id: jabatan }).first()
      if (existingJabatan) {
        jabatanId = existingJabatan.id
      } else {
        throw new BadRequest(`Jabatan dengan ID ${jabatan} tidak ditemukan.`)
      }

      // Handle aplikasi_id
      let aplikasiId
      const existingAplikasi = await trx('aplikasi').where({ id: aplikasi }).first()
      if (existingAplikasi) {
        aplikasiId = existingAplikasi.id
      } else {
        throw new BadRequest(`Aplikasi dengan ID ${aplikasi} tidak ditemukan.`)
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
