import { KnexService } from '@feathersjs/knex'
import path from 'path'

export class DokumenService extends KnexService {
  async create(data, params) {
    const knex = this.Model

    try {
      const result = await knex.transaction(async (trx) => {
        console.log('Incoming data:', data)
        const generateIdMulter = () => {
          return `${Date.now()}${Math.floor(Math.random() * 10)}`
        }

        let dokumenId
        const existingVersion = await trx('dokumen')
          .select('id')
          .where('nomor_dokumen', data.nomor_dokumen)
          .first()

        if (existingVersion) {
          dokumenId = existingVersion.id
          console.log(`Using existing dokumen_id: ${dokumenId}`)
        } else {
          const insertedDokumen = await trx('dokumen').insert({
            nomor_dokumen: data.nomor_dokumen,
            judul_dokumen: data.judul_dokumen,
            user_id: data.user_id,
            status: data.status,
            tgl_pengajuan: data.tgl_pengajuan || new Date()
          })

          dokumenId = insertedDokumen
          console.log(`Created new dokumen_id: ${dokumenId}`)
        }

        const approvals = [
          {
            urutan: 1,
            nama: data.nama_approval_1,
            email: data.email_approval_1,
            jabatan: data.jabatan_approval_1,
            jenis_group: data.jenis_group_1
          },
          {
            urutan: 2,
            nama: data.nama_approval_2,
            email: data.email_approval_2,
            jabatan: data.jabatan_approval_2,
            jenis_group: data.jenis_group_2
          },
          {
            urutan: 3,
            nama: data.nama_approval_3,
            email: data.email_approval_3,
            jabatan: data.jabatan_approval_3,
            jenis_group: data.jenis_group_3
          }
        ]

        const normalizedApprovals = approvals.map((approval) => ({
          urutan: approval.urutan,
          nama: Array.isArray(approval.nama) ? approval.nama : [approval.nama],
          email: Array.isArray(approval.email) ? approval.email : [approval.email],
          jabatan: Array.isArray(approval.jabatan) ? approval.jabatan : [approval.jabatan],
          jenis_group: approval.jenis_group
        }))

        for (const approval of normalizedApprovals) {
          const { urutan, nama, email, jabatan, jenis_group } = approval
          const group_index = approvals.findIndex((a) => a.urutan === urutan) + 1

          for (let i = 0; i < nama.length; i++) {
            const [insertedDokumenApprovalId] = await trx('dokumenapproval').insert({
              dokumen_id: Array.isArray(dokumenId) ? dokumenId[0] : dokumenId,
              nama: nama[i],
              email: email[i],
              jabatan: jabatan[i],
              index: i + 1,
              group_index: group_index,
              jenis_group: jenis_group,
              tgl_deadline: data.tgl_deadline || null,
              approval_status: 'pending'
            })
            const dokumenApproval = await trx('dokumenapproval')
              .where('id', insertedDokumenApprovalId)
              .first()

            console.log(`DokumenApproval: `, dokumenApproval)
            console.log(
              `Inserted approval: ${nama[i]}, Email: ${email[i]}, Index: ${i + 1}, Group Index: ${group_index}, Jenis Group: ${jenis_group}`
            )
          }
        }

        if (data.nama_file && data.tipe_file && data.size_file) {
          console.log('dokumenId:', dokumenId)

          // Ensure dokumenId is a scalar value
          const singleDokumenId = Array.isArray(dokumenId) ? dokumenId[0] : dokumenId
          console.log('Using dokumenId:', singleDokumenId)

          if (typeof singleDokumenId !== 'string' && typeof singleDokumenId !== 'number') {
            throw new Error('Invalid dokumen_id')
          }

          const maxVersionResult = await trx('dokumenversion')
            .where({ dokumen_id: parseInt(singleDokumenId) })
            .max('version as maxVersion')
            .first()

          const currentMaxVersion = maxVersionResult?.maxVersion || 0
          const newVersion = currentMaxVersion + 1
          const idMulter = generateIdMulter()

          const baseName = path.parse(data.nama_file).name
          const ext = path.extname(data.nama_file)
          const prefixedNamaFile = data.nama_file_multer

          const fileUrl = path.join('uploads', prefixedNamaFile)

          if (newVersion > 1) {
            console.log(`File already named correctly: ${fileUrl}`)
          }

          const mimeType = data.tipe_file
          const tipeFile = mimeType.split('/')[1]

          await trx('dokumenversion').insert({
            nama_file: prefixedNamaFile,
            file_url: fileUrl,
            tipe_file: tipeFile,
            size_file: data.size_file,
            dokumen_id: Array.isArray(dokumenId) ? dokumenId[0] : dokumenId,
            status: 'pending',
            tgl_upload: new Date(),
            deskripsi: data.deskripsi || null,
            version: newVersion,
            id_multer: idMulter || null
          })
          console.log('Inserted into dokumenversion for dokumen ID:', dokumenId)
        } else {
          console.log('No file data to insert into dokumenversion.')
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
            'dokumenversion.file_url'
          )
          .leftJoin('dokumenversion', 'dokumen.id', 'dokumenversion.dokumen_id')
          .where('dokumen.id', Array.isArray(dokumenId) ? dokumenId[0] : dokumenId)
          .orderBy('dokumenversion.version', 'desc')
          .first()

        console.log('Created document with version data:', createdDokumen)
        return createdDokumen
      })

      return result
    } catch (error) {
      console.error('Error in create:', error)
      throw error
    }
  }

  async find(params) {
    const knex = this.Model
    try {
      const documents = await knex('dokumen')
        .select(
          'dokumen.*',
          'dokumenversion.file_url',
          'dokumenversion.version',
          'dokumenversion.nama_file',
          'users.name'
        )
        .leftJoin('dokumenversion', 'dokumen.id', 'dokumenversion.dokumen_id')
        .leftJoin('users', 'dokumen.user_id', 'users.id')
        .where(
          'dokumenversion.version',
          knex.raw('(SELECT MAX(version) FROM dokumenversion WHERE dokumen_id = dokumen.id)')
        )

      return { data: documents }
    } catch (error) {
      console.error('Error in find:', error)
      throw error
    }
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

    // Lakukan patch default
    const result = await super.patch(id, data, params)

    // Tambahkan versi baru jika file diupdate
    // ...existing code...
    if (data.nama_file && data.tipe_file && data.size_file) {
      const trx = await this.Model.transaction()
      try {
        const singleDokumenId = id
        const maxVersionResult = await trx('dokumenversion')
          .where({ dokumen_id: singleDokumenId })
          .max('version as maxVersion')
          .first()

        const currentMaxVersion = maxVersionResult?.maxVersion || 0
        const newVersion = currentMaxVersion + 1

        const baseName = path.parse(data.nama_file).name
        const prefixedNamaFile = data.nama_file_multer
        // ...existing code...
        const fileUrl = path.join('uploads', prefixedNamaFile)
        const mimeType = data.tipe_file
        const tipeFile = mimeType.split('/')[1]

        await trx('dokumenversion').insert({
          nama_file: prefixedNamaFile,
          file_url: fileUrl,
          tipe_file: tipeFile,
          size_file: data.size_file,
          dokumen_id: singleDokumenId,
          status: 'pending',
          tgl_upload: new Date(),
          deskripsi: data.deskripsi || null,
          version: newVersion
        })

        await trx.commit()
      } catch (error) {
        await trx.rollback()
        throw error
      }
    }

    return result
  }

  async remove(id, params) {
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
