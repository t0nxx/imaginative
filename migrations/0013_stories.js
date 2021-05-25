const { Sequelize, DataTypes } = require("sequelize");
const { v4 } = require('uuid');

async function up(queryInterface) {
    await queryInterface.createTable("stories", {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        ownerId: {
            allowNull: false,
            type: new Sequelize.STRING(50),
            allowNull: false,
        },
        listingId: {
            type: new Sequelize.STRING(50),
            allowNull: true,
        },
        privacy: {
            type: new Sequelize.STRING(50),
            allowNull: false,
        },
        media: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        headerLine: {
            type: new Sequelize.STRING(200),
            allowNull: false,
        },
        disclaimerId: {
            type: new DataTypes.STRING(50),
            allowNull: false,
        },
        intro: {
            type: new DataTypes.STRING(3000),
            allowNull: true,
        },
        body: {
            type: new DataTypes.STRING(3000),
            allowNull: true,
        },
        tagline: {
            type: new DataTypes.STRING(200),
            allowNull: true,
        },
        conclusion: {
            type: new DataTypes.STRING(3000),
            allowNull: true,
        },
        imaginativeYear: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.SMALLINT,
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
    await queryInterface.dropTable("stories");
}

module.exports = { up, down };
