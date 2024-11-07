export async function up(knex) {
  await knex.schema.createTable('doc_approval', (table) => {
    table.increments('id').primary()
    table.integer('dokumen_id').unsigned().references('id').inTable('dokumen').onDelete('CASCADE')
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
    table.integer('index')
    table.enum('group_index', ['1,1,2,2', '1,2'])
    table.enum('jenis_group', ['single', 'double'])
    table.string('alasan_reject', 255)
    table.string('note', 255)
    table.string('approval_status', 255)
  })
}

export async function down(knex) {
  await knex.schema.dropTable('doc_approval')
}
