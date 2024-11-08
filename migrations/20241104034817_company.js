export async function up(knex) {
  await knex.schema.createTable('company', (table) => {
    table.increments('id')
    table.string('text')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('company')
}
