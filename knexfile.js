// Update with your config settings.

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'emails',
      user:     'postgres',
      password: 'admin'
    },
    debug: true,
  }
};
