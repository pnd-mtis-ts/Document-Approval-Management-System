export default function (app) {
    const db = app.get('knexClient');
    const tableName = 'usersprofile';
    
    db.schema.hasTable(tableName).then(exists => {
      if (!exists) {
        db.schema.createTable(tableName, table => {
          table.increments('id');
          table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
          table.string('jabatan');
          table.timestamp('created_at').defaultTo(db.fn.now());
          table.timestamp('updated_at').defaultTo(db.fn.now());
        })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
      }
    });
  
    return db;
  };