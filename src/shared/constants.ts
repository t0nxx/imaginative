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
//// this is the mobile app routes for creating dynamic links for sharing any thing
export enum DeepLinkShareRoutes {
  user = 'user',
  story = 'story',
  product = 'product',
}
/// this for type safe. after add any error to i18n files , you should add it here also
export enum ErrorCodes {
  // general errors
  YOU_ARE_NOT_ALLOWED_TO_EDIT_THIS_RESOURCE = 'YOU_ARE_NOT_ALLOWED_TO_EDIT_THIS_RESOURCE',

  //// user errors

  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  INVALID_TOKEN = 'INVALID_TOKEN',
  A_USER_WITH_THIS_EMAIL_ADDRESS_ALREADY_EXISTS = 'A_USER_WITH_THIS_EMAIL_ADDRESS_ALREADY_EXISTS',
  INVALID_OR_EXPIRED_LINK = 'INVALID_OR_EXPIRED_LINK',
  INVALID_VERIFICATION_CODE = 'INVALID_VERIFICATION_CODE',
  YOU_MUST_ENTER_OLD_PASSWORD = 'YOU_MUST_ENTER_OLD_PASSWORD',
  INVALID_OLD_PASSWORD = 'INVALID_OLD_PASSWORD',
  INVALID_OR_EXPIRED_TOKEN = 'INVALID_OR_EXPIRED_TOKEN',

  //// story errors
  LISTING_NOT_FOUND = 'LISTING_NOT_FOUND',
  STORY_NOT_FOUND = 'STORY_NOT_FOUND',

  //// comments errors
  COMMENT_NOT_FOUND = 'COMMENT_NOT_FOUND',
}

export enum MessageCodes {
  // general msgs

  DONE = 'DONE',

  // user msgs
  PASSWORD_CHANGED_SUCCESSFULLY = 'PASSWORD_CHANGED_SUCCESSFULLY',
  PROFILE_UPDATED_SUCCESSFULLY = 'PROFILE_UPDATED_SUCCESSFULLY',
  EMAIL_RESET_PASSWORD_SENT = 'EMAIL_RESET_PASSWORD_SENT',
  EMAIL_VERIFICATION_CODE_SENT = 'EMAIL_VERIFICATION_CODE_SENT',

  // story msgs
}
