const { Sequelize } = require("sequelize");
const { v4 } = require('uuid');
const disclaimers = [
    { id: v4(), code: "This Story is imaginative and used to promote Product/Service/Skill/Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "This Story is imaginative and used to express dreams and imaginations", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "This Story is imaginative and used to express new ideas", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "This Story is imaginative", createdAt: new Date(), updatedAt: new Date() },
];

const localizedDisclaimers = [
    { id: v4(), language: "en", refId: disclaimers[0].id, name: "This Story is imaginative and used to promote Product/Service/Skill/Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: disclaimers[1].id, name: "This Story is imaginative and used to express dreams and imaginations", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: disclaimers[2].id, name: "This Story is imaginative and used to express new ideas", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: disclaimers[3].id, name: "This Story is imaginative", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: disclaimers[0].id, name: "هذة القصة تخيلية و تستخدم للترويج للمنتج/الخدمة/المهارة/المحتوي", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: disclaimers[1].id, name: "هذا الخبر تخيلي و يستخدم للتعبير عن الأحلام و التخيلات", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: disclaimers[2].id, name: "هذا الخبر تخيلي و يستخدم للتعبير عن الأفكار الجديدة", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: disclaimers[3].id, name: "هذه القصة تخيلية", createdAt: new Date(), updatedAt: new Date() },
]

async function up(queryInterface) {
    await queryInterface.createTable("disclaimers", {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        code: {
            type: new Sequelize.STRING(150),
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

    await queryInterface.bulkInsert('disclaimers', disclaimers);

    await queryInterface.createTable("localized_disclaimers", {
        id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        name: {
            type: new Sequelize.STRING(150),
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

    await queryInterface.bulkInsert('localized_disclaimers', localizedDisclaimers);

}

async function down(queryInterface) {
    await queryInterface.dropTable("localized_disclaimers");
    await queryInterface.dropTable("disclaimers");
}

module.exports = { up, down };
