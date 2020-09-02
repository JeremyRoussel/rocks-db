var db = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'postgres',
      database : 'rock-catalogue'
    }
});

const selection = "user, name, project, field, well, sampleID, file_loc"

db.select(selection).from('catalogue')
    .join('thin_section', {'sampleID': 'catalogue.id'})
    .then(items => {
        console.log(items)
    })
    .catch(error => {
        console.error(error)
    })

