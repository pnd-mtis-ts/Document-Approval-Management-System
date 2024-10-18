export default function (app) {
    const db = app.get('knexClient');
    const tableName = 'users';
    
    db.schema.hasTable(tableName).then(exists => {
      if(!exists) {
        db.schema.createTable(tableName, table => {
          table.increments('id');
          table.string('name');
          table.string('email').unique();
          table.string('password');
          table.string('pin');
          table.timestamp('created_at').defaultTo(db.fn.now());
          table.timestamp('updated_at').defaultTo(db.fn.now());
        })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
      }
    });
  
    return db;
  };