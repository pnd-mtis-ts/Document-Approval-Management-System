// transaksi.class.js
import { KnexService } from '@feathersjs/knex';

export class TransaksiService extends KnexService {
  // Membuat transaksi baru
  async create(data, params) {
    const knex = this.options.Model;
    const { aplikasi_id, ...transaksiData } = data;

    // Validasi bahwa aplikasi_id ada di tabel aplikasi
    const aplikasi = await knex('aplikasi').where({ id: aplikasi_id }).first();
    if (!aplikasi) {
      throw new Error('Aplikasi tidak ditemukan');
    }

    // Insert transaksi baru
    const [id] = await knex('transaksi').insert({
      ...transaksiData,
      aplikasi_id,
    });

    // Ambil transaksi yang baru dibuat beserta data aplikasi
    const transaksi = await knex('transaksi')
      .select('transaksi.*', 'aplikasi.name as aplikasi_name')
      .leftJoin('aplikasi', 'transaksi.aplikasi_id', 'aplikasi.id')
      .where('transaksi.id', id)
      .first();

    return transaksi;
  }

  // Mengambil daftar transaksi
  async find(params) {
    const knex = this.options.Model;
    const query = knex('transaksi')
      .select('transaksi.*', 'aplikasi.name as aplikasi_name')
      .leftJoin('aplikasi', 'transaksi.aplikasi_id', 'aplikasi.id');

    // Terapkan filter jika ada
    if (params.query) {
      query.where(params.query);
    }

    const data = await query;

    return data;
  }

  // Mengambil transaksi berdasarkan ID
  async get(id, params) {
    const knex = this.options.Model;
    const transaksi = await knex('transaksi')
      .select('transaksi.*', 'aplikasi.name as aplikasi_name')
      .leftJoin('aplikasi', 'transaksi.aplikasi_id', 'aplikasi.id')
      .where('transaksi.id', id)
      .first();

    if (!transaksi) {
      throw new Error('Transaksi tidak ditemukan');
    }

    return transaksi;
  }

  // Memperbarui transaksi
  async patch(id, data, params) {
    const knex = this.options.Model;
    const { aplikasi_id, ...transaksiData } = data;

    // Validasi aplikasi_id jika diperbarui
    if (aplikasi_id) {
      const aplikasi = await knex('aplikasi').where({ id: aplikasi_id }).first();
      if (!aplikasi) {
        throw new Error('Aplikasi tidak ditemukan');
      }
    }

    // Update transaksi
    await knex('transaksi')
      .where({ id })
      .update({
        ...transaksiData,
        aplikasi_id,
      });

    // Ambil transaksi yang sudah diperbarui
    const transaksi = await knex('transaksi')
      .select('transaksi.*', 'aplikasi.name as aplikasi_name')
      .leftJoin('aplikasi', 'transaksi.aplikasi_id', 'aplikasi.id')
      .where('transaksi.id', id)
      .first();

    return transaksi;
  }

  // Menghapus transaksi
  async remove(id, params) {
    const knex = this.options.Model;

    // Hapus transaksi
    await knex('transaksi')
      .where({ id })
      .del();

    return { id };
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'transaksi',
  };
};