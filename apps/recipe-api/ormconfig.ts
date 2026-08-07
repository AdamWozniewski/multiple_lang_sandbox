const { default: dbConfig } = require("./src/config/database.config");

module.exports = {
  ...dbConfig,
  entities: ["src/**/*.entity.{ts,js}"],
  seeds: ["src/database/seeders/seeds/**/*.{ts,js}"],
  factories: ["src/database/seeders/factories/**/*.{ts,js}"],
};
