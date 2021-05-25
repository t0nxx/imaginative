const { Sequelize } = require("sequelize");
const { v4 } = require('uuid');
const listingTypes = [
    { id: v4(), code: "Physical product", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Real estate project", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Mall", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Cafe/Restaurant", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Sporting Club", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Other Project", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Touristic place", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Games", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Mobile app", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Software", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "E-book", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Other digital product", category: "Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "YouTube videos", category: "Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Blogs", category: "Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Written Blogs", category: "Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Tv programs/news", category: "Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Radio programs/news", category: "Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Podcasts", category: "Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Press/Magazine Articles", category: "Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Video Education courses", category: "Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Other Content", category: "Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Digital marketing", category: "Service", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Advertising", category: "Service", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Graphic designing", category: "Service", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Photographing", category: "Service", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Content creating", category: "Service", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Programming", category: "Service", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Other service", category: "Service", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Playing Football", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Playing Cricket", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Playing tennis table", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Playing Squash", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Playing Chess", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Other Sport Skill", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Composing/Telling jokes", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Telling Stories", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Composing poems", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Composing music", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Writing Stories", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Writing Articles", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Costs killer", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Costs budgeting", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Sourcing products/material cheaply", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Cooking", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Making deserts", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Tasting food/deserts", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Voice over", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Drawing", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Engineering drawing", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Calligraphing", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Painting", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Hand crafting things", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Fixing Electrical devices", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Fixing Computers", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Baby sitter", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Elder people sitter", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Pets sitter", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Nursing", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Public Speaker in presentations/events", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Teaching", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Networking/Socializing with people", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Photographing", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Designing products", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Traveling/Discovering new touristic places", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Other skill/talent", category: "Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), code: "Other Product", category: "Product", createdAt: new Date(), updatedAt: new Date() },
];


const localizedListingTypes = [
    { id: v4(), language: "en", refId: listingTypes[0].id, name: "Physical product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[1].id, name: "Real estate project", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[2].id, name: "Mall", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[3].id, name: "Cafe/Restaurant", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[4].id, name: "Sporting Club", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[5].id, name: "Other Project", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[6].id, name: "Touristic place", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[7].id, name: "Games", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[8].id, name: "Mobile app", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[9].id, name: "Software", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[10].id, name: "E-book", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[11].id, name: "Other digital product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[12].id, name: "YouTube videos", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[13].id, name: "Blogs", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[14].id, name: "Written Blogs", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[15].id, name: "Tv programs/news", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[16].id, name: "Radio programs/news", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[17].id, name: "Podcasts", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[18].id, name: "Press/Magazine Articles", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[19].id, name: "Video Education courses", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[20].id, name: "Other Content", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[21].id, name: "Digital marketing", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[22].id, name: "Advertising", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[23].id, name: "Graphic designing", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[24].id, name: "Photographing", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[25].id, name: "Content creating", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[26].id, name: "Programming", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[27].id, name: "Other service", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[28].id, name: "Playing Football", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[29].id, name: "Playing Cricket", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[30].id, name: "Playing tennis table", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[31].id, name: "Playing Squash", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[32].id, name: "Playing Chess", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[33].id, name: "Other Sport Skill", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[34].id, name: "Composing/Telling jokes", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[35].id, name: "Telling Stories", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[36].id, name: "Composing poems", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[37].id, name: "Composing music", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[38].id, name: "Writing Stories", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[39].id, name: "Writing Articles", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[40].id, name: "Costs killer", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[41].id, name: "Costs budgeting", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[42].id, name: "Sourcing products/material cheaply", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[43].id, name: "Cooking", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[44].id, name: "Making deserts", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[45].id, name: "Tasting food/deserts", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[46].id, name: "Voice over", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[47].id, name: "Drawing", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[48].id, name: "Engineering drawing", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[49].id, name: "Calligraphing", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[50].id, name: "Painting", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[51].id, name: "Hand crafting things", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[52].id, name: "Fixing Electrical devices", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[53].id, name: "Fixing Computers", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[54].id, name: "Baby sitter", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[55].id, name: "Elder people sitter", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[56].id, name: "Pets sitter", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[57].id, name: "Nursing", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[58].id, name: "Public Speaker in presentations/events", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[59].id, name: "Teaching", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[60].id, name: "Networking/Socializing with people", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[61].id, name: "Photographing", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[62].id, name: "Designing products", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[63].id, name: "Traveling/Discovering new touristic places", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[64].id, name: "Other skill/talent", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "en", refId: listingTypes[65].id, name: "Other Product", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[0].id, name: "منتج", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[1].id, name: "مشروع عقاري", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[2].id, name: "مول", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[3].id, name: "كافيه/مطعم", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[4].id, name: "نادي رياضي", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[5].id, name: "مشرع اخر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[6].id, name: "معلم سياحي", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[7].id, name: "ألعاب", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[8].id, name: "تطبيق موبايل", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[9].id, name: "برمجيات", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[10].id, name: "كتاب الكتروني", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[11].id, name: "منتج الكتروني اخر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[12].id, name: "فيديو يوتيوب", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[13].id, name: "مدونه/ بلوج", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[14].id, name: "مدونات مكتوبه", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[15].id, name: "برامج و أخبار تلفزيونية ", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[16].id, name: "برامج وأخبار إذاعية", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[17].id, name: "مدونات صوتية", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[18].id, name: "مقالات صحفية / مقالات مجلات ", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[19].id, name: "فيديوهات تعليمية ( دورات )", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[20].id, name: "محتوى أخر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[21].id, name: "تسويق الكتروني", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[22].id, name: "إعلانات", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[23].id, name: "تصميم جرافيك", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[24].id, name: "تصوير", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[25].id, name: "إنشاء محتوي ", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[26].id, name: "برمجة كمبيوتر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[27].id, name: "خدمات أخرى", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[28].id, name: "كرة قدم", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[29].id, name: "كريكيت", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[30].id, name: "تنس طاولة", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[31].id, name: "سكواش", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[32].id, name: "شطرنج", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[33].id, name: "مهارات رياضية أخرى", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[34].id, name: "تأليف و إلقاء النكات", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[35].id, name: "رواية القصص", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[36].id, name: "تأليف شعر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[37].id, name: "تأليف موسيقى", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[38].id, name: "كتابة قصص", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[39].id, name: "كتابة مقالات", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[40].id, name: "تقليص التكاليف", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[41].id, name: "تقدير التكاليف", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[42].id, name: "تحديد مصادر المنتجات والمواد الرخيصة", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[43].id, name: "طهي", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[44].id, name: "صناعة حلويات", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[45].id, name: "تذوق الطعام والحلوى", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[46].id, name: "تعليق صوتي ", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[47].id, name: "رسم", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[48].id, name: "رسم هندسي", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[49].id, name: "خطاط", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[50].id, name: "دهان الحوائط ( شقق و فيلات )", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[51].id, name: "  حرف يدوية", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[52].id, name: "صيانة أجهزة كهربية", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[53].id, name: "صيانة كمبيوتر", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[54].id, name: "رعاية أطفال", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[55].id, name: "رعاية كبار السن", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[56].id, name: "رعاية حيوانات", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[57].id, name: "تمريض", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[58].id, name: "خطابة ", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[59].id, name: "تعليم", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[60].id, name: "تواصل إجتماعي ", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[61].id, name: "تصوير", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[62].id, name: "تصميم منتجات", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[63].id, name: "سفر واستكشاف أماكن سياحية", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[64].id, name: "مهارات أخرى", createdAt: new Date(), updatedAt: new Date() },
    { id: v4(), language: "ar", refId: listingTypes[65].id, name: "منتج أخر", createdAt: new Date(), updatedAt: new Date() },
]



async function up(queryInterface) {
    await queryInterface.createTable("listing_types", {
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
        category: {
            type: new Sequelize.STRING(50),
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

    await queryInterface.bulkInsert('listing_types', listingTypes);

    await queryInterface.createTable("localized_listing_types", {
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
            type: Sequelize.STRING,
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

    await queryInterface.bulkInsert('localized_listing_types', localizedListingTypes);

}

async function down(queryInterface) {
    await queryInterface.dropTable("localized_listing_types");
    await queryInterface.dropTable("listing_types");
}

module.exports = { up, down };