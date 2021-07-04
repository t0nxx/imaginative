export enum ListingStatus {
  Draft,
  Published,
}
/// in lookups listing type
export enum ListingTypesEnum {
  Product = 'Product',
  Content = 'Content',
  Skill = 'Skill',
  Service = 'Service',
}

/// this for type safe. after add any error to i18n files , you should add it here also 
export enum ErrorCodes {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_TOKEN = 'INVALID_TOKEN',
  A_USER_WITH_THIS_EMAIL_ADDRESS_ALREADY_EXISTS = 'A_USER_WITH_THIS_EMAIL_ADDRESS_ALREADY_EXISTS',
  INVALID_OR_EXPIRED_LINK = 'INVALID_OR_EXPIRED_LINK',
  INVALID_VERIFICATION_CODE = 'INVALID_VERIFICATION_CODE',
  YOU_MUST_ENTER_OLD_PASSWORD = 'YOU_MUST_ENTER_OLD_PASSWORD',
  INVALID_OLD_PASSWORD = 'INVALID_OLD_PASSWORD',
  INVALID_OR_EXPIRED_TOKEN = 'INVALID_OR_EXPIRED_TOKEN',
}
//// this is the mobile app routes for creating dynamic links for sharing any thing
export enum DeepLinkShareRoutes {
  user = 'user',
  story = 'story',
  product = 'product',
}
