const { Sequelize } = require("sequelize");

async function up(queryInterface) {

  await queryInterface.changeColumn("users", "hash", {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: null,
  });
}

async function down(queryInterface) {
  await queryInterface.changeColumn("users", "hash", {
    type: Sequelize.STRING,
    allowNull: false,
  });
}

module.exports = { up, down };
