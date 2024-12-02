import { KnexService } from '@feathersjs/knex'
import path from 'path'

export class DokumenService extends KnexService {
  async create(data, params) {
    const knex = this.Model;

    try {
      const result = await knex.transaction(async (trx) => {
      
        console.log('Incoming data:', data);
        
        const insertedDokumen = await trx('dokumen').insert({
          nomor_dokumen: data.nomor_dokumen,
          judul_dokumen: data.judul_dokumen,
          user_id: data.user_id,
          status: data.status,
          tgl_pengajuan: data.tgl_pengajuan || new Date(),
        });

        const dokumenId = insertedDokumen[0];

        if (data.nama_file && data.tipe_file && data.size_file) {
          
          const maxVersionResult = await trx('dokumenversion')
            .where('dokumen_id', dokumenId)
            .max('version as maxVersion')
            .first();

          const currentMaxVersion = maxVersionResult.maxVersion || 0;
          const newVersion = currentMaxVersion + 1;

          const ext = path.extname(data.nama_file); // Contoh: '.pdf'
          const baseName = path.basename(data.nama_file, ext); // Contoh: 'bitbyte'

          const prefixedNamaFile = data.id_multer
          ? `${data.id_multer}-${baseName}_versi_${newVersion}${ext}`
          : `${baseName}_versi_${newVersion}${ext}`;

          const fileUrl = path.join('uploads', prefixedNamaFile);

          await trx('dokumenversion').insert({
            nama_file: prefixedNamaFile,
            file_url: fileUrl,
            tipe_file: data.tipe_file,
            size_file: data.size_file,
            dokumen_id: dokumenId,
            status: 'pending',
            tgl_upload: new Date(),
            deskripsi: data.deskripsi || null,
            version: newVersion,
            id_multer: data.id_multer || null,
          });
          console.log('Inserted into dokumenversion for dokumen ID:', dokumenId);
        } else {
          console.log('No file data to insert into dokumenversion.');
        }

        const createdDokumen = await trx('dokumen')
          .select(
            'dokumen.id',
            'dokumen.nomor_dokumen',
            'dokumen.judul_dokumen',
            'dokumen.user_id',
            'dokumen.status',
            'dokumen.tgl_pengajuan',
            'dokumenversion.id_multer',
            'dokumenversion.nama_file ',
            'dokumenversion.tipe_file ',
            'dokumenversion.size_file',
            'dokumenversion.tgl_upload',
            'dokumenversion.version',
            'dokumenversion.deskripsi',
            'dokumenversion.file_url',
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

    return super.find(params)
  }

  async get(id, params) {
    
    const { user } = params
    const dokumen = await super.get(id, params)

    return dokumen
  }

  async patch(id, data, params) {
    
    const { user } = params
    const dokumen = await this.get(id, params)

    if (user.role !== 'admin' && dokumen.user_id !== user.id) {
      throw new Error('Tidak memiliki akses untuk mengubah dokumen ini')
    }

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
