const { Sequelize, DataTypes } = require("sequelize");
const { v4 } = require('uuid');

async function up(queryInterface) {
    await queryInterface.createTable("listing_followers", {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        userId: {
            allowNull: false,
            type: new Sequelize.STRING(50),
            allowNull: false,
        },
        listingId: {
            type: new Sequelize.STRING(50),
            allowNull: true,
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
    await queryInterface.dropTable("listing_followers");
}

module.exports = { up, down };
