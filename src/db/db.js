const knex = require('knex')({
    client: 'pg',
    connection: {
      host : 'postgres',
      user : 'postgres',
      password : 'postgres',
      database : 'postgres',
      port: '5432'
    }
  })




module.exports = {
    db: knex,
    down: ()=>knex.schema.dropTable('users'),
    up: ()=>  {
       return  knex.schema
        .createTable('users', table => {
        table.increments('id')
        table.string('name')
        table.string('email')
        }).then(()=>{
            return knex.insert({ name: 'test', email: 'test@example.com' }).table('users')
        })
    }
}