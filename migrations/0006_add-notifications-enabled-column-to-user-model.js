const { Sequelize } = require("sequelize");

async function up(queryInterface) {

  await queryInterface.addColumn("users", "notificationsEnabled", {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
}

async function down(queryInterface) {
  await queryInterface.removeColumn("users", "notificationsEnabled");
}

module.exports = { up, down };
