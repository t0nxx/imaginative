const { Sequelize } = require("sequelize");

async function up(queryInterface) {

  await queryInterface.dropAllTables();
  await queryInterface.createTable("users", {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    photoUrl: {
      type: new Sequelize.STRING(300),
      allowNull: true,
    },
    featuredProductName: {
      type: new Sequelize.STRING(200),
      allowNull: true,
    },
    featuredProductId: {
      type: new Sequelize.STRING(50),
      allowNull: true,
    },
    hash: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    googleId: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    facebookId: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  await queryInterface.createTable("password_recovery_tokens", {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

async function down(queryInterface) {
  await queryInterface.dropTable("users");
  await queryInterface.dropTable("password_recovery_tokens");
}

module.exports = { up, down };
