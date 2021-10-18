'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nest-typescript-starter documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/ApplicationModule.html" data-type="entity-link">ApplicationModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CoreModule-35f48ec0762afbefc4b1f72681988635"' : 'data-target="#xs-controllers-links-module-CoreModule-35f48ec0762afbefc4b1f72681988635"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CoreModule-35f48ec0762afbefc4b1f72681988635"' :
                                            'id="xs-controllers-links-module-CoreModule-35f48ec0762afbefc4b1f72681988635"' }>
                                            <li class="link">
                                                <a href="controllers/FilesController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-35f48ec0762afbefc4b1f72681988635"' : 'data-target="#xs-injectables-links-module-CoreModule-35f48ec0762afbefc4b1f72681988635"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-35f48ec0762afbefc4b1f72681988635"' :
                                        'id="xs-injectables-links-module-CoreModule-35f48ec0762afbefc4b1f72681988635"' }>
                                        <li class="link">
                                            <a href="injectables/FileService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FileService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FireBaseService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FireBaseService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalizationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocalizationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MailsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MailsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DevModule.html" data-type="entity-link">DevModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-DevModule-60344b5665eebbafd952fc8d1c82d3ad"' : 'data-target="#xs-controllers-links-module-DevModule-60344b5665eebbafd952fc8d1c82d3ad"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DevModule-60344b5665eebbafd952fc8d1c82d3ad"' :
                                            'id="xs-controllers-links-module-DevModule-60344b5665eebbafd952fc8d1c82d3ad"' }>
                                            <li class="link">
                                                <a href="controllers/CacheController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CacheController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DevController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DevController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ListingModule.html" data-type="entity-link">ListingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ListingModule-f2b1bf0fd7d6a6b977de0af7faf03011"' : 'data-target="#xs-controllers-links-module-ListingModule-f2b1bf0fd7d6a6b977de0af7faf03011"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ListingModule-f2b1bf0fd7d6a6b977de0af7faf03011"' :
                                            'id="xs-controllers-links-module-ListingModule-f2b1bf0fd7d6a6b977de0af7faf03011"' }>
                                            <li class="link">
                                                <a href="controllers/ListingController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListingController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ListingModule-f2b1bf0fd7d6a6b977de0af7faf03011"' : 'data-target="#xs-injectables-links-module-ListingModule-f2b1bf0fd7d6a6b977de0af7faf03011"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ListingModule-f2b1bf0fd7d6a6b977de0af7faf03011"' :
                                        'id="xs-injectables-links-module-ListingModule-f2b1bf0fd7d6a6b977de0af7faf03011"' }>
                                        <li class="link">
                                            <a href="injectables/ListingService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ListingService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LookupsModule.html" data-type="entity-link">LookupsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-LookupsModule-81f38241db87d564875f08d84d9fb95a"' : 'data-target="#xs-controllers-links-module-LookupsModule-81f38241db87d564875f08d84d9fb95a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LookupsModule-81f38241db87d564875f08d84d9fb95a"' :
                                            'id="xs-controllers-links-module-LookupsModule-81f38241db87d564875f08d84d9fb95a"' }>
                                            <li class="link">
                                                <a href="controllers/LookupsController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LookupsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LookupsModule-81f38241db87d564875f08d84d9fb95a"' : 'data-target="#xs-injectables-links-module-LookupsModule-81f38241db87d564875f08d84d9fb95a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LookupsModule-81f38241db87d564875f08d84d9fb95a"' :
                                        'id="xs-injectables-links-module-LookupsModule-81f38241db87d564875f08d84d9fb95a"' }>
                                        <li class="link">
                                            <a href="injectables/LookupsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LookupsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StoryModule.html" data-type="entity-link">StoryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StoryModule-e76373f9efed22e32169d228b8d4193a"' : 'data-target="#xs-controllers-links-module-StoryModule-e76373f9efed22e32169d228b8d4193a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StoryModule-e76373f9efed22e32169d228b8d4193a"' :
                                            'id="xs-controllers-links-module-StoryModule-e76373f9efed22e32169d228b8d4193a"' }>
                                            <li class="link">
                                                <a href="controllers/StoryController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StoryController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/StoryDraftController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StoryDraftController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/StoryTemplateController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StoryTemplateController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StoryModule-e76373f9efed22e32169d228b8d4193a"' : 'data-target="#xs-injectables-links-module-StoryModule-e76373f9efed22e32169d228b8d4193a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StoryModule-e76373f9efed22e32169d228b8d4193a"' :
                                        'id="xs-injectables-links-module-StoryModule-e76373f9efed22e32169d228b8d4193a"' }>
                                        <li class="link">
                                            <a href="injectables/StoryService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StoryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-c07b8d6a6d9e9b85cc6ceef431d6913e"' : 'data-target="#xs-controllers-links-module-UserModule-c07b8d6a6d9e9b85cc6ceef431d6913e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-c07b8d6a6d9e9b85cc6ceef431d6913e"' :
                                            'id="xs-controllers-links-module-UserModule-c07b8d6a6d9e9b85cc6ceef431d6913e"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-c07b8d6a6d9e9b85cc6ceef431d6913e"' : 'data-target="#xs-injectables-links-module-UserModule-c07b8d6a6d9e9b85cc6ceef431d6913e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-c07b8d6a6d9e9b85cc6ceef431d6913e"' :
                                        'id="xs-injectables-links-module-UserModule-c07b8d6a6d9e9b85cc6ceef431d6913e"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllExceptionsFilter.html" data-type="entity-link">AllExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppCache.html" data-type="entity-link">AppCache</a>
                            </li>
                            <li class="link">
                                <a href="classes/CacheObject.html" data-type="entity-link">CacheObject</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommentDto.html" data-type="entity-link">CommentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateListingDto.html" data-type="entity-link">CreateListingDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateListingReviewDto.html" data-type="entity-link">CreateListingReviewDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateStoryDraftDto.html" data-type="entity-link">CreateStoryDraftDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateStoryDto.html" data-type="entity-link">CreateStoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgetPasswordDto.html" data-type="entity-link">ForgetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginUserDto.html" data-type="entity-link">LoginUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MailProcessor.html" data-type="entity-link">MailProcessor</a>
                            </li>
                            <li class="link">
                                <a href="classes/MediaDto.html" data-type="entity-link">MediaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationTokenDto.html" data-type="entity-link">NotificationTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationResult.html" data-type="entity-link">OperationResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDto.html" data-type="entity-link">RefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterUserDto.html" data-type="entity-link">RegisterUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDto.html" data-type="entity-link">ResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchListingDto.html" data-type="entity-link">SearchListingDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchStoryDto.html" data-type="entity-link">SearchStoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocialLoginDto.html" data-type="entity-link">SocialLoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateListingDto.html" data-type="entity-link">UpdateListingDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateStoryDto.html" data-type="entity-link">UpdateStoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link">UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserSnippetDto.html" data-type="entity-link">UserSnippetDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/VerifyEmailDto.html" data-type="entity-link">VerifyEmailDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthMiddleware.html" data-type="entity-link">AuthMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FireBaseService.html" data-type="entity-link">FireBaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OptionalAuthMiddleware.html" data-type="entity-link">OptionalAuthMiddleware</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CurrencyDto.html" data-type="entity-link">CurrencyDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DisclaimerDto.html" data-type="entity-link">DisclaimerDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GenericLookupDto.html" data-type="entity-link">GenericLookupDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HiringTypeDto.html" data-type="entity-link">HiringTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListingDto.html" data-type="entity-link">ListingDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListingReviewDto.html" data-type="entity-link">ListingReviewDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListingTypeDto.html" data-type="entity-link">ListingTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PriceTypeDto.html" data-type="entity-link">PriceTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StoryDto.html" data-type="entity-link">StoryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ToggleListingFollowDto.html" data-type="entity-link">ToggleListingFollowDto</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});