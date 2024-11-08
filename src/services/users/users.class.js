import { KnexService } from '@feathersjs/knex';
import bcrypt from 'bcrypt';
import { BadRequest } from '@feathersjs/errors';

export class UsersService extends KnexService {
  constructor(options) {
    super(options);
    this.knex = options.Model;
  }

  async create(data, params) {
    const { alamat, nomor_telepon, role, ...userData } = data;

    // Check if user already exists
    const existingUser = await this.find({
      query: { email: userData.email }
    });

    if (existingUser.total > 0) {
      throw new BadRequest('User with this email already exists.');
    }

    // Generate unique username
    const baseName = userData.name;
    let nameWithSuffix = baseName;
    let count = 1;

    while (await this.find({ query: { name: nameWithSuffix } }).total > 0) {
      nameWithSuffix = `${baseName}${count}`;
      count++;
    }

    userData.name = nameWithSuffix;

    const trx = await this.knex.transaction();
 
    try {
      let newUser;
      if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        [newUser] = await trx('users').insert({
          ...userData,
          password: hashedPassword,
        });
      } else {
        const { googleId } = userData;
        [newUser] = await trx('users').insert({
          ...userData,
          googleId,
        });
      }

      // Fetch the newly created user
      newUser = await trx('users').where('id', newUser).first();

      // Create user profile with jabatan
      await trx('usersprofile').insert({
        user_id: newUser.id,
        alamat: alamat,
        nomor_telepon: nomor_telepon
      });

      // Create or fetch role
      let roleId;
      const existingRole = await trx('usersrole').where({ name: role }).first();
      if (existingRole) {
        roleId = existingRole.id;
      } else {
        [roleId] = await trx('usersrole').insert({ name: role });
      }
        
      // Create user auth entry
      await trx('usersauth').insert({
        user_id: newUser.id,
        role_id: roleId
      });

      await trx.commit();

      const createdProfile = await this.knex('usersprofile').where({ user_id: newUser.id }).first();
      const createdAuth = await this.knex('usersauth')
        .select('usersauth.*', 'usersrole.name as role')
        .join('usersrole', 'usersauth.role_id', 'usersrole.id')
        .where({ 'usersauth.user_id': newUser.id })
        .first();

      return {
        ...newUser,
        userProfile: createdProfile,
        userAuth: createdAuth
      };
    } catch (error) {
      // If anything goes wrong, roll back the transaction
      await trx.rollback();
      throw error;
    }
  }

  async find(params) {
    const users = await super.find(params);
    
    for (let user of users.data) {
      // Get userProfile with role and jabatan
      user.userProfile = await this.knex('usersprofile')
        .select(
          'usersprofile.*',
          'usersrole.name as role',
          'jabatan.nama_jabatan as jabatan'
        )
        .where({ 'usersprofile.user_id': user.id })
        .leftJoin('usersauth', 'usersprofile.user_id', 'usersauth.user_id')
        .leftJoin('usersrole', 'usersauth.role_id', 'usersrole.id')
        .leftJoin('jabatan', 'usersauth.jabatan_id', 'jabatan.id')
        .first();
        
      user.userAuth = await this.knex('usersauth')
        .select('usersauth.*')
        .where({ 'usersauth.user_id': user.id })
        .first();
    }
  
    return users;
  }

  async get(id, params) {
    const user = await super.get(id, params);
    
    // Get userProfile with role and jabatan
    user.userProfile = await this.knex('usersprofile')
      .select(
        'usersprofile.*',
        'usersrole.name as role',
        'jabatan.nama_jabatan as jabatan'
      )
      .where({ 'usersprofile.user_id': id })
      .leftJoin('usersauth', 'usersprofile.user_id', 'usersauth.user_id')
      .leftJoin('usersrole', 'usersauth.role_id', 'usersrole.id')
      .leftJoin('jabatan', 'usersauth.jabatan_id', 'jabatan.id')
      .first();
  
    // Get userAuth without role and jabatan
    user.userAuth = await this.knex('usersauth')
      .select('usersauth.*')
      .where({ 'usersauth.user_id': id })
      .first();
  
    return user;
  } 

  async patch(id, data, params) {
    const { alamat,nomor_telepon , role, ...userData } = data;
    
    // Start a transaction
    const trx = await this.knex.transaction();

    try {
      // Update user data
      await trx('users').where({ id }).update(userData);
      
        const existingProfile = await trx('usersprofile').where({ user_id: id }).first();
        if (existingProfile) {
          await trx('usersprofile').where({ user_id: id }).update({ alamat, nomor_telepon });
        } else {
          await trx('usersprofile').insert({ user_id: id, alamat, nomor_telepon });
        }
      
      if (role !== undefined) {
        let roleId;
        const existingRole = await trx('usersrole').where({ name: role }).first();
        if (existingRole) {
          roleId = existingRole.id;
        } else {
          [roleId] = await trx('usersrole').insert({ name: role });
        }

        const existingAuth = await trx('usersauth').where({ user_id: id }).first();
        if (existingAuth) {
          await trx('usersauth').where({ user_id: id }).update({ role_id: roleId });
        } else {
          await trx('usersauth').insert({ user_id: id, role_id: roleId });
        }
      }

      // Commit the transaction
      await trx.commit();

      // Fetch and return the updated user with profile and auth
      return this.get(id, params);
    } catch (error) {
      // If anything goes wrong, roll back the transaction
      await trx.rollback();
      throw error;
    }
  }

 
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mysqlClient'),
    name: 'users'
  };
};