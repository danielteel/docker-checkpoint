
exports.up = function(knex) {
  return knex.schema.createTable('emails', table => {
    table.increments('id');
    table.string('sender').notNullable();
    table.string('recipient').notNullable();
    table.string('subject');
    table.string('message', 500);
    table.date('date');
  });
}; 


exports.down = function(knex) {
    return knex.schema.dropTableIfExists('emails');
};
