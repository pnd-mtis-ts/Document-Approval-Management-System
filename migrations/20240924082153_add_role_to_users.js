// Buat file migrasi dengan nama yang sesuai
export const up = function(knex) {
    return knex.schema.table('users', function(table) {
      table.string('role'); // Menambahkan kolom 'role'
    });
  };
  
  export const down = function(knex) {
    return knex.schema.table('users', function(table) {
      table.dropColumn('role'); // Menghapus kolom 'role' jika migrasi dibatalkan
    });
  };
  