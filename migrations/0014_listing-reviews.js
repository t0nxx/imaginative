const { Sequelize, DataTypes } = require("sequelize");
const { v4 } = require('uuid');

async function up(queryInterface) {
    await queryInterface.createTable("listing_reviews", {
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
        title: {
            type: new Sequelize.STRING(50),
            allowNull: false,
        },
        goodAboutListing: {
            type: new Sequelize.STRING(50),
            allowNull: false,
        },
        notGoodAboutListing: {
            type: new DataTypes.STRING(50),
            allowNull: false,
        },
        reviewText: {
            type: new DataTypes.STRING(500),
            allowNull: false,
        },
        starRating: {
            type: DataTypes.FLOAT,
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
    await queryInterface.dropTable("listing_reviews");
}

module.exports = { up, down };
