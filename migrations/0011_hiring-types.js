const { Sequelize } = require("sequelize");
const { v4 } = require('uuid');
const hiringTypes = [
    { id: v4(), code: "Freelancer", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Intern", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Part Time", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Full Time", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Team player", createdAt: new Date(), updatedAt: new Date() },
    //{ id: v4(), code: "Other", createdAt: new Date(), updatedAt: new Date() },
];

const localizedHiringTypes = [
    { id: v4(), language: "en", refId: hiringTypes[0].id, name: "Freelancer", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: hiringTypes[1].id, name: "Intern", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: hiringTypes[2].id, name: "Part Time", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: hiringTypes[3].id, name: "Full Time", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: hiringTypes[4].id, name: "Team player", createdAt: new Date(), updatedAt: new Date() },
    //{ id: v4(), language: "en", refId: hiringTypes[5].id, name: "Other", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: hiringTypes[0].id, name: "عمل حر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: hiringTypes[1].id, name: "متدرب", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: hiringTypes[2].id, name: "دوام جزئي", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: hiringTypes[3].id, name: "دوام كامل", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: hiringTypes[4].id, name: "عضو في الفريق", createdAt: new Date(), updatedAt: new Date() },
    //{ id: v4(), language: "ar", refId: hiringTypes[5].id, name: "أخرى", createdAt: new Date(), updatedAt: new Date() },
]

async function up(queryInterface) {
    await queryInterface.createTable("hiring_types", {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        code: {
            type: new Sequelize.STRING(128),
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

    await queryInterface.bulkInsert('hiring_types', hiringTypes);

    await queryInterface.createTable("localized_hiring_types", {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        name: {
            type: new Sequelize.STRING(100),
            allowNull: false,
        },
        language: {
            type: new Sequelize.STRING(10),
            allowNull: false,
        },
        refId: {
            type: Sequelize.UUID,
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

    await queryInterface.bulkInsert('localized_hiring_types', localizedHiringTypes);

}

async function down(queryInterface) {
    await queryInterface.dropTable("localized_hiring_types");
    await queryInterface.dropTable("hiring_types");
}

module.exports = { up, down };
