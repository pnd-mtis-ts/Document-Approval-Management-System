// signature.class.js
import { KnexService } from '@feathersjs/knex';

export class SignatureService extends KnexService {
  // Membuat signature baru
  async create(data, params) {
    const knex = this.options.Model;
    const { user_id, ...signatureData } = data;

    // Validasi bahwa user_id ada di tabel users
    const user = await knex('users').where({ id: user_id }).first();
    if (!user) {
      throw new Error('User tidak ditemukan');
    }

    // Insert signature baru
    const [id] = await knex('signature').insert({
      ...signatureData,
      user_id,
    });

    // Ambil signature yang baru dibuat beserta data user
    const signature = await knex('signature')
      .select('signature.*', 'users.name as name', 'users.email as email')
      .leftJoin('users', 'signature.user_id', 'users.id')
      .where('signature.id', id)
      .first();

    return signature;
  }

  // Mengambil daftar signature
  async find(params) {
    const knex = this.options.Model;
    const query = knex('signature')
      .select('signature.*', 'users.name as name', 'users.email as email')
      .leftJoin('users', 'signature.user_id', 'users.id');

    // Terapkan filter jika ada
    if (params.query) {
      query.where(params.query);
    }

    const data = await query;

    return data;
  }

  // Mengambil signature berdasarkan ID
  async get(id, params) {
    const knex = this.options.Model;
    const signature = await knex('signature')
      .select('signature.*', 'users.name as name', 'users.email as email')
      .leftJoin('users', 'signature.user_id', 'users.id')
      .where('signature.id', id)
      .first();

    if (!signature) {
      throw new Error('Signature tidak ditemukan');
    }

    return signature;
  }

  // Memperbarui signature
  async patch(id, data, params) {
    const knex = this.options.Model;
    const { user_id, ...signatureData } = data;

    // Validasi user_id jika ada
    if (user_id) {
      const user = await knex('users').where({ id: user_id }).first();
      if (!user) {
        throw new Error('User tidak ditemukan');
      }
    }

    // Update signature
    await knex('signature')
      .where({ id })
      .update({
        ...signatureData,
        user_id,
      });

    // Ambil signature yang sudah diperbarui
    const signature = await knex('signature')
      .select('signature.*', 'users.name as name', 'users.email as email')
      .leftJoin('users', 'signature.user_id', 'users.id')
      .where('signature.id', id)
      .first();

    return signature;
  }

  // Menghapus signature
  async remove(id, params) {
    const knex = this.options.Model;

    // Hapus signature
    await knex('signature')
      .where({ id })
      .del();

    return { id };
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'signature',
  };
};