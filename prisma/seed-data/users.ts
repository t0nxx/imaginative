enum AccountRuleEnum {
  user = 'user',
  admin = 'admin',
}

enum AccountTypeEnum {
  individual = 'individual',
  company = 'company',
  institution = 'institution',
}

enum AccountTypeProviderEnum {
  local = 'local',
  facebook = 'facebook',
  google = 'google',
  apple = 'apple',
}
export const users = [
  {
    name: 'admin account',
    email: 'a@a.com',
    photoUrl:
      'https://gravatar.com/avatar/14978c9024af3c17cf195dff095d79e8?s=400&d=robohash&r=x',
    featuredProductName: null,
    featuredProductId: null,
    // this pass is asd123456
    password: '$2a$10$8oopKOygF6kzIu9TT47JrehCw9DK8JUW8bBU0DrHbrAtLQPS3eGCC',
    lang: 'en',
    notificationsEnabled: true,
    provider: AccountTypeProviderEnum.local,
    type: AccountTypeEnum.individual,
    role: AccountRuleEnum.admin,
  },
  {
    name: 'company account',
    email: 'b@b.com',
    photoUrl:
      'https://gravatar.com/avatar/14978c9024af3c17cf195dff095d79e8?s=400&d=robohash&r=x',
    featuredProductName: null,
    featuredProductId: null,
    // this pass is asd123456
    password: '$2a$10$8oopKOygF6kzIu9TT47JrehCw9DK8JUW8bBU0DrHbrAtLQPS3eGCC',
    lang: 'en',
    notificationsEnabled: true,
    provider: AccountTypeProviderEnum.local,
    type: AccountTypeEnum.company,
    role: AccountRuleEnum.user,
  },
  {
    name: 'institution account',
    email: 'c@c.com',
    photoUrl:
      'https://gravatar.com/avatar/14978c9024af3c17cf195dff095d79e8?s=400&d=robohash&r=x',
    featuredProductName: null,
    featuredProductId: null,
    // this pass is asd123456

    password: '$2a$10$8oopKOygF6kzIu9TT47JrehCw9DK8JUW8bBU0DrHbrAtLQPS3eGCC',
    lang: 'en',
    notificationsEnabled: true,
    provider: AccountTypeProviderEnum.local,
    type: AccountTypeEnum.institution,
    role: AccountRuleEnum.user,
  },
];
