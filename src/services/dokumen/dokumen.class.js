import { KnexService } from '@feathersjs/knex'

export class DokumenService extends KnexService {
  async create(data, params) {
    const knex = this.Model;

    try {
      const result = await knex.transaction(async (trx) => {
        // Log the incoming data for debugging
        console.log('Incoming data:', data);

        // Insert into 'dokumen' table
        const insertedDokumen = await trx('dokumen').insert({
          judul_dokumen: data.judul_dokumen,
          file_url: data.file_url,
          user_id: data.user_id,
          status: data.status,
          tgl_pengajuan: new Date(),
        });

        // Retrieve the inserted dokumen ID
        // For MySQL, trx('dokumen').insert returns an array of inserted IDs
        const dokumenId = insertedDokumen[0];
        console.log('Inserted into dokumen with ID:', dokumenId);

        // Check if file data exists
        if (data.nama_file && data.tipe_file && data.size_file) {
          // Insert into 'dokumenversion' table
          await trx('dokumenversion').insert({
            nama_file: data.nama_file,
            tipe_file: data.tipe_file,
            size_file: data.size_file,
            dokumen_id: dokumenId,
            status: 'pending',
            tgl_upload: new Date(),
            deskripsi: data.deskripsi || null,
          });
          console.log('Inserted into dokumenversion for dokumen ID:', dokumenId);
        } else {
          console.log('No file data to insert into dokumenversion.');
        }

        // Fetch and return the created document with version data
        const createdDokumen = await trx('dokumen')
          .select(
            'dokumen.id',
            'dokumen.judul_dokumen',
            'dokumen.file_url',
            'dokumen.user_id',
            'dokumen.status',
            'dokumen.tgl_pengajuan',
            'dokumenversion.nama_file as nama_file',
            'dokumenversion.tipe_file as tipe_file',
            'dokumenversion.size_file',
            'dokumenversion.tgl_upload',
            'dokumenversion.version',
            'dokumenversion.deskripsi'
          )
          .leftJoin('dokumenversion', 'dokumen.id', 'dokumenversion.dokumen_id')
          .where('dokumen.id', dokumenId)
          .first();

        console.log('Created document with version data:', createdDokumen);
        return createdDokumen;
      });

      return result;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async find(params) {
    // Call the find method from KnexService without restrictions
    return super.find(params)
  }

  async get(id, params) {
    // Add logic to check access if needed
    const { user } = params
    const dokumen = await super.get(id, params)

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
