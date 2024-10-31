import { KnexService } from '@feathersjs/knex'

export class DokumenService extends KnexService {
  async create(data, params) {
    console.log('Create method data:', data)
    console.log('Create method params:', params)

    // Ensure file is correctly set in params
    if (params.file) {
      data.file_url = params.file.path
    }

    // Ensure all required fields are present
    const requiredFields = ['judul_dokumen', 'tgl_deadline']
    for (let field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Field '${field}' harus diisi`)
      }
    }

    // Add user_id from authenticated user
    data.user_id = params.user.id

    // Set default status
    data.status = 'pending'

    // Convert tgl_deadline to the correct format for the database (if needed)
    if (data.tgl_deadline) {
      data.tgl_deadline = new Date(data.tgl_deadline).toISOString().split('T')[0]
    }

    // Call the create method from KnexService
    return super.create(data, params)
  }

  async find(params) {
    // Call the find method from KnexService without restrictions
    return super.find(params)
  }

  async get(id, params) {
    // Add logic to check access if needed
    const { user } = params
    const dokumen = await super.get(id, params)

    if (user.role !== 'admin' && dokumen.user_id !== user.id) {
      throw new Error('Tidak memiliki akses ke dokumen ini')
    }

    return dokumen
  }

  async patch(id, data, params) {
    // Add logic to check access and validation if needed
    const { user } = params
    const dokumen = await this.get(id, params)

    if (user.role !== 'admin' && dokumen.user_id !== user.id) {
      throw new Error('Tidak memiliki akses untuk mengubah dokumen ini')
    }

    // Only allow certain updates
    const allowedUpdates = ['judul_dokumen', 'tgl_deadline', 'status']
    Object.keys(data).forEach((key) => {
      if (!allowedUpdates.includes(key)) {
        delete data[key]
      }
    })

    return super.patch(id, data, params)
  }

  async remove(id, params) {
    // Add logic to check access if needed
    const { user } = params
    const dokumen = await this.get(id, params)

    if (user.role !== 'admin' && dokumen.user_id !== user.id) {
      throw new Error('Tidak memiliki akses untuk menghapus dokumen ini')
    }

    return super.remove(id, params)
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'dokumen'
  }
}
