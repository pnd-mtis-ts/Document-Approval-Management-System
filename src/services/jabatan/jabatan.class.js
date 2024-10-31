import { KnexService } from '@feathersjs/knex'

export class JabatanService extends KnexService {
  async create(data, params) {
    const knex = this.Model;
    try {
      // Start transaction
      const result = await knex.transaction(async (trx) => {
        // Insert into jabatan table dan dapatkan id yang baru dibuat
        const [jabatanId] = await trx('jabatan')
          .insert({
            nama_jabatan: data.nama_jabatan
          });

        // Jika ada user_id yang dikirim, update jabatan_id di table usersauth
        if (data.user_id) {
          await trx('usersauth')
            .where('user_id', data.user_id)
            .update({ jabatan_id: jabatanId });
        }

        // Return created jabatan with joined user data
        const createdJabatan = await trx('jabatan')
          .select('jabatan.*', 'usersauth.user_id')
          .leftJoin('usersauth', 'jabatan.id', 'usersauth.jabatan_id')
          .where('jabatan.id', jabatanId)
          .first();

        return createdJabatan;
      });

      return result;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async find(params) {
    const knex = this.Model;
    try {
      const query = knex('jabatan')
        .select(
          'jabatan.*',
          knex.raw('GROUP_CONCAT(usersauth.user_id) as user_id')
        )
        .leftJoin('usersauth', 'jabatan.id', 'usersauth.jabatan_id')
        .groupBy('jabatan.id');

      // Apply any filters from params
      if (params.query) {
        const { $select, $sort, $limit, $skip, ...filters } = params.query;
        
        Object.keys(filters).forEach(key => {
          query.where(`jabatan.${key}`, filters[key]);
        });
      }

      const results = await query;
      
      // Format the results to include users as an array
      return results.map(result => ({
        ...result,
        user_id: result.user_id ? result.user_id.split(',').map(Number) : []
      }));
    } catch (error) {
      console.error('Error in find:', error);
      throw error;
    }
  }

  async get(id, params) {
    const knex = this.Model;
    try {
      const result = await knex('jabatan')
        .select(
          'jabatan.*',
          knex.raw('GROUP_CONCAT(usersauth.user_id) as user_id')
        )
        .leftJoin('usersauth', 'jabatan.id', 'usersauth.jabatan_id')
        .where('jabatan.id', id)
        .groupBy('jabatan.id')
        .first();

      if (!result) {
        throw new Error('Jabatan not found');
      }

      // Format the result to include users as an array
      return {
        ...result,
        user_id: result.user_id ? result.user_id.split(',').map(Number) : []
      };
    } catch (error) {
      console.error('Error in get:', error);
      throw error;
    }
  }

  async patch(id, data, params) {
    const knex = this.Model;
    try {
      return await knex.transaction(async (trx) => {
        // Update jabatan table
        await trx('jabatan')
          .where('id', id)
          .update({
            nama_jabatan: data.nama_jabatan
          });

        // If user_id is provided, update usersauth table
        if (data.user_id) {
          // First remove existing jabatan_id if any
          if (data.remove_previous === true) {
            await trx('usersauth')
              .where('jabatan_id', id)
              .update({ jabatan_id: null });
          }

          // Then update the new user's jabatan_id
          await trx('usersauth')
            .where('id', data.user_id)
            .update({ jabatan_id: id });
        }

        // Return updated jabatan with user data
        return trx('jabatan')
          .select(
            'jabatan.*',
            knex.raw('GROUP_CONCAT(usersauth.user_id) as user_id')
          )
          .leftJoin('usersauth', 'jabatan.id', 'usersauth.jabatan_id')
          .where('jabatan.id', id)
          .groupBy('jabatan.id')
          .first();
      });
    } catch (error) {
      console.error('Error in patch:', error);
      throw error;
    }
  }

  async remove(id, params) {
    const knex = this.Model;
    try {
      return await knex.transaction(async (trx) => {
        // Get jabatan data before deletion
        const jabatan = await trx('jabatan')
          .select(
            'jabatan.*',
            knex.raw('GROUP_CONCAT(usersauth.user_id) as user_id')
          )
          .leftJoin('usersauth', 'jabatan.id', 'usersauth.jabatan_id')
          .where('jabatan.id', id)
          .groupBy('jabatan.id')
          .first();

        if (!jabatan) {
          throw new Error('Jabatan not found');
        }

        // Update usersauth to remove jabatan_id reference
        await trx('usersauth')
          .where('jabatan_id', id)
          .update({ jabatan_id: null });

        // Delete from jabatan table
        await trx('jabatan')
          .where('id', id)
          .del();

        return jabatan;
      });
    } catch (error) {
      console.error('Error in remove:', error);
      throw error;
    }
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'jabatan'
  }
}