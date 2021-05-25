const { Sequelize, DataTypes } = require("sequelize");
const { v4 } = require('uuid');

async function up(queryInterface) {
    await queryInterface.createTable("listings", {
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
        pageType: {
            type: new Sequelize.STRING(50),
            allowNull: false,
        },
        listingTypeId: {
            type: new Sequelize.STRING(50),
            allowNull: false,
        },
        privacy: {
            type: new Sequelize.STRING(50),
            allowNull: false,
        },
        media: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        name: {
            type: new Sequelize.STRING(200),
            allowNull: false,
        },
        brandName: {
            type: new Sequelize.STRING(200),
            allowNull: false,
        },
        description: {
            type: new Sequelize.STRING(3000),
            allowNull: false,
        },
        stockAvailability: {
            type: new DataTypes.STRING(70),
            allowNull: false,
        },
        advantages: {
            type: new Sequelize.STRING(2000),
            allowNull: false,
        },
        uses: {
            type: new Sequelize.STRING(1500),
            allowNull: false,
        },
        credentials: {
            type: new Sequelize.STRING(3000),
            allowNull: false,
        },
        url: {
            type: new Sequelize.STRING(400),
            allowNull: false,
        },
        priceTypeId: {
            type: new Sequelize.STRING(50),
            allowNull: false,
        },
        otherPriceType: {
            type: new Sequelize.STRING(150),
            allowNull: true,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        currencyId: {
            type: new Sequelize.STRING(50),
            allowNull: true,
        },
        hiringTypeId: {
            type: new Sequelize.STRING(50),
            allowNull: true,
        },
        otherHiring: {
            type: new Sequelize.STRING(150),
            allowNull: true,
        },
        offerPrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        offerDescription: {
            type: new Sequelize.STRING(3000),
            allowNull: false,
        },
        socialLinks: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        viewsCount: {
            type: DataTypes.INTEGER,
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
        status: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        isEdited: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        overallRating: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        totalRatingCount: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    });

}

async function down(queryInterface) {
    await queryInterface.dropTable("listings");
}

module.exports = { up, down };
