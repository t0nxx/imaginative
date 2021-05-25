const { Sequelize } = require("sequelize");
const { v4 } = require('uuid');
const priceTypes = [
    { id: v4(), code: "Fixed amount", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Starting from", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Starting from fixed amount / week", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Starting from fixed amount / month", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Starting from fixed amount / 3 months", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Starting from fixed amount / 6 months", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Starting from fixed amount / year", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Free", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Fixed amount / week", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Fixed amount / month", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Fixed amount / 3 months", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Fixed amount / 6 months", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Fixed amount / year", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Starting from fixed amount / square meter", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Fixed amount / square meter", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Starting from Rate / hour", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Rate / hour", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Estimates-based price", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Negotiable", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "As per employer price", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "As per purchaser price", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Other", createdAt: new Date(), updatedAt: new Date() },
];

const localizedPriceTypes = [
    { id: v4(), refId: priceTypes[0].id, language: "en", name: "Fixed amount", format: "*PRICE *CURRENCY", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[1].id, language: "en", name: "Starting from", format: "*TYPE *PRICE *CURRENCY", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[2].id, language: "en", name: "Starting from fixed amount / week", format: "Starting from \n*PRICE *CURRENCY / week", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[3].id, language: "en", name: "Starting from fixed amount / month", format: "Starting from \n*PRICE *CURRENCY / month", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[4].id, language: "en", name: "Starting from fixed amount / 3 months", format: "Starting from \n*PRICE *CURRENCY / 3 months", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[5].id, language: "en", name: "Starting from fixed amount / 6 months", format: "Starting from \n*PRICE *CURRENCY / 6 months", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[6].id, language: "en", name: "Starting from fixed amount / year", format: "Starting from \n*PRICE *CURRENCY / year", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[7].id, language: "en", name: "Free", format: "*TYPE", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[8].id, language: "en", name: "Fixed amount / week", format: "*PRICE *CURRENCY / week", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[9].id, language: "en", name: "Fixed amount / month", format: "*PRICE *CURRENCY / month", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[10].id, language: "en", name: "Fixed amount / 3 months", format: "*PRICE *CURRENCY / 3 months", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[11].id, language: "en", name: "Fixed amount / 6 months", format: "*PRICE *CURRENCY / 6 months", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[12].id, language: "en", name: "Fixed amount / year", format: "*PRICE *CURRENCY / year", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[13].id, language: "en", name: "Starting from fixed amount / square meter ", format: "Starting from \n*PRICE *CURRENCY / square meter", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[14].id, language: "en", name: "Fixed amount / square meter ", format: "*PRICE *CURRENCY / square meter", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[15].id, language: "en", name: "Starting from Rate / hour ", format: "Starting from \n*PRICE *CURRENCY / hour", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[16].id, language: "en", name: "Rate / hour", format: "*PRICE *CURRENCY / hour", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[17].id, language: "en", name: "Estimates-based price ", format: "*TYPE", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[18].id, language: "en", name: "Negotiable", format: "*TYPE\n*PRICE *CURRENCY", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[19].id, language: "en", name: "As per employer price", format: "*TYPE", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[20].id, language: "en", name: "As per purchaser price", format: "*TYPE", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[21].id, language: "en", name: "Other", format: "*TYPE\n*PRICE *CURRENCY", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[0].id, language: "ar", name: "مبلغ محدد", format: "*PRICE *CURRENCY", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[1].id, language: "ar", name: "السعر يبدأ من", format: "السعر يبدأ من \n*PRICE *CURRENCY", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[2].id, language: "ar", name: "يبدأ من مبلغ محدد / الاسبوع", format: "يبدأ من \n*PRICE *CURRENCY / الاسبوع", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[3].id, language: "ar", name: "يبدأ  من مبلغ محدد /الشهر", format: "يبدأ  من \n*PRICE *CURRENCY /الشهر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[4].id, language: "ar", name: "يبدأ من مبلغ محدد /٣ أشهر", format: "يبدأ من \n*PRICE *CURRENCY /٣ أشهر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[5].id, language: "ar", name: " يبدأ من مبلغ محدد /٦ أشهر", format: " يبدأ من \n*PRICE *CURRENCY /٦ أشهر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[6].id, language: "ar", name: "يبدأ من مبلغ محدد / عام واحد", format: "يبدأ من *PRICE *CURRENCY / عام واحد", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[7].id, language: "ar", name: "مجاني", format: "*TYPE", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[8].id, language: "ar", name: "مبلغ محدد / الاسبوع", format: "*PRICE *CURRENCY / الاسبوع", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[9].id, language: "ar", name: "مبلغ محدد /الشهر", format: "*PRICE *CURRENCY /الشهر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[10].id, language: "ar", name: "مبلغ محدد /٣ أشهر", format: "*PRICE *CURRENCY /٣ أشهر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[11].id, language: "ar", name: "مبلغ محدد /٦ أشهر", format: "*PRICE *CURRENCY /٦ أشهر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[12].id, language: "ar", name: "مبلغ محدد / عام واحد", format: "*PRICE *CURRENCY / عام واحد", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[13].id, language: "ar", name: "يبدأ من السعر / المتر المربع  ", format: "يبدأ من \n*PRICE *CURRENCY / المتر المربع  ", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[14].id, language: "ar", name: "السعر / المتر المربع ", format: "*PRICE *CURRENCY / المتر المربع ", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[15].id, language: "ar", name: "يبدأ من معدل الأجره في الساعه ", format: "يبدأ من \n*PRICE *CURRENCY في الساعه ", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[16].id, language: "ar", name: "معدل الأجره في الساعه", format: "*PRICE *CURRENCY في الساعه", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[17].id, language: "ar", name: "السعر حسب المقايسه ", format: "*TYPE", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[18].id, language: "ar", name: "سعر يمكن التفاوض عليه", format: "*TYPE\n*PRICE *CURRENCY", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[19].id, language: "ar", name: "سعر يتم تحديده من  صاحب العمل", format: "*TYPE", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[20].id, language: "ar", name: "سعر يتم تحديده من المشتري", format: "*TYPE", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), refId: priceTypes[21].id, language: "ar", name: "أخرى", format: "*TYPE\n*PRICE *CURRENCY", createdAt: new Date(), updatedAt: new Date() }
]

async function up(queryInterface) {
    await queryInterface.createTable("price_types", {
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

    await queryInterface.bulkInsert('price_types', priceTypes);

    await queryInterface.createTable("localized_price_types", {
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
        format: {
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

    await queryInterface.bulkInsert('localized_price_types', localizedPriceTypes);

}

async function down(queryInterface) {
    await queryInterface.dropTable("localized_price_types");
    await queryInterface.dropTable("price_types");
}

module.exports = { up, down };
