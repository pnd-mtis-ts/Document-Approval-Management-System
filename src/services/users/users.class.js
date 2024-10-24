import { KnexService } from '@feathersjs/knex';
import bcrypt from 'bcrypt';
import { BadRequest } from '@feathersjs/errors';

export class UsersService extends KnexService {
  constructor(options) {
    super(options);
    this.knex = options.Model;
  }

  async create(data, params) {
    const { jabatan, role, ...userData } = data;

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
        jabatan: jabatan
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

      // Commit the transaction
      await trx.commit();

      // Fetch the created profile and auth
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
    
    // Fetch associated user profiles and auth
    for (let user of users.data) {
      user.userProfile = await this.knex('usersprofile').where({ user_id: user.id }).first();
      user.userAuth = await this.knex('usersauth')
        .select('usersauth.*', 'usersrole.name as role')
        .join('usersrole', 'usersauth.role_id', 'usersrole.id')
        .where({ 'usersauth.user_id': user.id })
        .first();
    }
    return users;
  }

  async get(id, params) {
    const user = await super.get(id, params);
    user.userProfile = await this.knex('usersprofile').where({ user_id: id }).first();
    user.userAuth = await this.knex('usersauth')
      .select('usersauth.*', 'usersrole.name as role')
      .join('usersrole', 'usersauth.role_id', 'usersrole.id')
      .where({ 'usersauth.user_id': id })
      .first();
    return user;
  } 

  async patch(id, data, params) {
    const { jabatan, role, ...userData } = data;
    
    // Start a transaction
    const trx = await this.knex.transaction();

    try {
      // Update user data
      await trx('users').where({ id }).update(userData);

      // Update or create user profile
      if (jabatan !== undefined) {
        const existingProfile = await trx('usersprofile').where({ user_id: id }).first();
        if (existingProfile) {
          await trx('usersprofile').where({ user_id: id }).update({ jabatan });
        } else {
          await trx('usersprofile').insert({ user_id: id, jabatan });
        }
      }

      // Update role if provided
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