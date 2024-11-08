// aplikasi.class.js
import { KnexService } from '@feathersjs/knex';

export class AplikasiService extends KnexService {
  // Membuat aplikasi baru
  async create(data, params) {
    const knex = this.options.Model;
    const { company_id, user_id, ...aplikasiData } = data;

    // Validasi bahwa company_id ada di tabel company
    const company = await knex('company').where({ id: company_id }).first();
    if (!company) {
      throw new Error('Company tidak ditemukan');
    }

    // Mulai transaksi
    const result = await knex.transaction(async (trx) => {
      // Insert aplikasi baru
      const [id] = await trx('aplikasi').insert({
        ...aplikasiData,
        company_id,
      });

      // Update usersauth jika user_id diberikan
      if (user_id) {
        await trx('usersauth')
          .where({ user_id })
          .update({ aplikasi_id: id });
      }

      // Ambil aplikasi yang baru dibuat beserta data company
      const aplikasi = await trx('aplikasi')
        .select('aplikasi.*', 'company.name as company_name')
        .leftJoin('company', 'aplikasi.company_id', 'company.id')
        .where('aplikasi.id', id)
        .first();

      return aplikasi;
    });

    return result;
  }
  // Mengambil daftar aplikasi
  async find(params) {
    const knex = this.options.Model;
    const query = knex('aplikasi')
      .select('aplikasi.*', 'company.name as company_name')
      .leftJoin('company', 'aplikasi.company_id', 'company.id');

    // Terapkan filter jika ada
    if (params.query) {
      query.where(params.query);
    }

    const data = await query;

    return data;
  }

  // Mengambil aplikasi berdasarkan ID
  async get(id, params) {
    const knex = this.options.Model;
    const aplikasi = await knex('aplikasi')
      .select('aplikasi.*', 'company.name as company_name')
      .leftJoin('company', 'aplikasi.company_id', 'company.id')
      .where('aplikasi.id', id)
      .first();

    if (!aplikasi) {
      throw new Error('Aplikasi tidak ditemukan');
    }

    return aplikasi;
  }

  // Memperbarui aplikasi
  async patch(id, data, params) {
    const knex = this.options.Model;
    const { company_id, ...aplikasiData } = data;

    // Validasi company_id jika diperbarui
    if (company_id) {
      const company = await knex('company').where({ id: company_id }).first();
      if (!company) {
        throw new Error('Company tidak ditemukan');
      }
    }

    // Update aplikasi
    await knex('aplikasi')
      .where({ id })
      .update({
        ...aplikasiData,
        company_id,
      });

    // Ambil aplikasi yang sudah diperbarui
    const aplikasi = await knex('aplikasi')
      .select('aplikasi.*', 'company.name as company_name')
      .leftJoin('company', 'aplikasi.company_id', 'company.id')
      .where('aplikasi.id', id)
      .first();

    return aplikasi;
  }

  // Menghapus aplikasi
  async remove(id, params) {
    const knex = this.options.Model;

    // Hapus aplikasi
    await knex('aplikasi')
      .where({ id })
      .del();

    return { id };
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'aplikasi',
  };
};