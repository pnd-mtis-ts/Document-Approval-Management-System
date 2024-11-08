import { KnexService } from '@feathersjs/knex';

export class CompanyService extends KnexService {
  async create(data, params) {
    const knex = this.Model;
    try {
      // Start transaction
      const result = await knex.transaction(async (trx) => {
        const [companyId] = await trx('company')
          .insert({
            name: data.name,
            address: data.address,
            no_phone: data.no_phone
          });

        if (data.user_id) {
          await trx('usersauth')
            .where('user_id', data.user_id)
            .update({ company_id: companyId });
        }
        
        const createdCompany = await trx('company')
          .select('company.*', 'usersauth.user_id')
          .leftJoin('usersauth', 'company.id', 'usersauth.company_id')
          .where('company.id', companyId)
          .first();

        return createdCompany;
      });

      return result;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  }

  async find(params) {
    const companies = await super.find(params);

    // Jika perlu, fetch juga data terkait dari tabel usersauth dan aplikasi
    const relatedData = await Promise.all(companies.data.map(async (company) => {
      const usersauth = await this.options.Model('usersauth').where({ company_id: company.id });
      const aplikasi = await this.options.Model('aplikasi').where({ company_id: company.id });
      return {
        ...company,
        usersauth,
        aplikasi
      };
    }));

    return { data: relatedData };
  }

  // Mendefinisikan fungsi get (GET specific company by id)
  async get(id, params) {
    const company = await super.get(id, params);

    // Fetch data terkait dari tabel usersauth dan aplikasi
    const usersauth = await this.options.Model('usersauth').where({ company_id: id });
    const aplikasi = await this.options.Model('aplikasi').where({ company_id: id });

    return {
      ...company,
      usersauth,
      aplikasi
    };
  }

  // Mendefinisikan fungsi patch (PATCH update partial data of a company by id)
  async patch(id, data, params) {
    const knex = this.Model;
    try {
      return await knex.transaction(async (trx) => {
        // Update jabatan table
        await trx('company')
          .where('id', id)
          .update({
            name: data.name,
            address: data.address,
            no_phone: data.no_phone 
          });

        // If user_id is provided, update usersauth table
        if (data.user_id) {
          // First remove existing company_id if any
          if (data.remove_previous === true) {
            await trx('usersauth')
              .where('company_id', id)
              .update({ company_id: null });
          }

          // Then update the new user's jabatan_id
          await trx('usersauth')
            .where('id', data.user_id)
            .update({ company_id: id });
        }

        // Return updated jabatan with user data
        return trx('company')
          .select(
            'company.*',
            knex.raw('GROUP_CONCAT(usersauth.user_id) as user_id')
          )
          .leftJoin('usersauth', 'company.id', 'usersauth.company_id')
          .where('company.id', id)
          .groupBy('company.id')
          .first();
      });
    } catch (error) {
      console.error('Error in patch:', error);
      throw error;
    }
  }

  // Mendefinisikan fungsi remove (DELETE a company by id)
  async remove(id, params) {
    const knex = this.Model;
    try {
      return await knex.transaction(async (trx) => {
        // Get jabatan data before deletion
        const company = await trx('company')
          .select(
            'company.*',
            knex.raw('GROUP_CONCAT(usersauth.user_id) as user_id')
          )
          .leftJoin('usersauth', 'company.id', 'usersauth.company_id')
          .where('company.id', id)
          .groupBy('company.id')
          .first();

        if (!company) {
          throw new Error('Jabatan not found');
        }

        // Update usersauth to remove jabatan_id reference
        await trx('usersauth')
          .where('company_id', id)
          .update({ company_id: null });

        // Delete from jabatan table
        await trx('company')
          .where('id', id)
          .del();

        return company;
      });
    } catch (error) {
      console.error('Error in remove:', error);
      throw error;
    }
  }
}

// Fungsi untuk mendapatkan konfigurasi koneksi
export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'company'
  };
};
