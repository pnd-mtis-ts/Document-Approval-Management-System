// Buat file migrasi dengan nama yang sesuai
export const up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.enu('role', ['User', 'Admin', 'SuperAdmin', 'Aplikasi']).alter(); // Kembalikan jika diperlukan
  });
};

export const down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.enu('role', ['User', 'Admin', 'SuperAdmin']).alter();
  });
};
 

