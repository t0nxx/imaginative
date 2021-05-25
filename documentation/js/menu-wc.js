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
                                <a href="modules/AppLoggerModule.html" data-type="entity-link">AppLoggerModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppLoggerModule-923724687d5cdd18d051c34eaa87967e"' : 'data-target="#xs-injectables-links-module-AppLoggerModule-923724687d5cdd18d051c34eaa87967e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppLoggerModule-923724687d5cdd18d051c34eaa87967e"' :
                                        'id="xs-injectables-links-module-AppLoggerModule-923724687d5cdd18d051c34eaa87967e"' }>
                                        <li class="link">
                                            <a href="injectables/AppLogger.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppLogger</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-86c0e21db59e41c36f598a78f9a33b38"' : 'data-target="#xs-injectables-links-module-CoreModule-86c0e21db59e41c36f598a78f9a33b38"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-86c0e21db59e41c36f598a78f9a33b38"' :
                                        'id="xs-injectables-links-module-CoreModule-86c0e21db59e41c36f598a78f9a33b38"' }>
                                        <li class="link">
                                            <a href="injectables/FireBase.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FireBase</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MailManager.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MailManager</a>
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
                                            'data-target="#controllers-links-module-ListingModule-37d3f7826082e9f02fdb4aaf71cb00e2"' : 'data-target="#xs-controllers-links-module-ListingModule-37d3f7826082e9f02fdb4aaf71cb00e2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ListingModule-37d3f7826082e9f02fdb4aaf71cb00e2"' :
                                            'id="xs-controllers-links-module-ListingModule-37d3f7826082e9f02fdb4aaf71cb00e2"' }>
                                            <li class="link">
                                                <a href="controllers/ListingController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListingController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ListingModule-37d3f7826082e9f02fdb4aaf71cb00e2"' : 'data-target="#xs-injectables-links-module-ListingModule-37d3f7826082e9f02fdb4aaf71cb00e2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ListingModule-37d3f7826082e9f02fdb4aaf71cb00e2"' :
                                        'id="xs-injectables-links-module-ListingModule-37d3f7826082e9f02fdb4aaf71cb00e2"' }>
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
                                            'data-target="#controllers-links-module-LookupsModule-838c6a9b17c1218fa0d1a474afecf70d"' : 'data-target="#xs-controllers-links-module-LookupsModule-838c6a9b17c1218fa0d1a474afecf70d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LookupsModule-838c6a9b17c1218fa0d1a474afecf70d"' :
                                            'id="xs-controllers-links-module-LookupsModule-838c6a9b17c1218fa0d1a474afecf70d"' }>
                                            <li class="link">
                                                <a href="controllers/FilesController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilesController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/LookupsController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LookupsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LookupsModule-838c6a9b17c1218fa0d1a474afecf70d"' : 'data-target="#xs-injectables-links-module-LookupsModule-838c6a9b17c1218fa0d1a474afecf70d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LookupsModule-838c6a9b17c1218fa0d1a474afecf70d"' :
                                        'id="xs-injectables-links-module-LookupsModule-838c6a9b17c1218fa0d1a474afecf70d"' }>
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
                                            'data-target="#controllers-links-module-StoryModule-258f35285daf10d83892955d474c0549"' : 'data-target="#xs-controllers-links-module-StoryModule-258f35285daf10d83892955d474c0549"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StoryModule-258f35285daf10d83892955d474c0549"' :
                                            'id="xs-controllers-links-module-StoryModule-258f35285daf10d83892955d474c0549"' }>
                                            <li class="link">
                                                <a href="controllers/StoryController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StoryController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StoryModule-258f35285daf10d83892955d474c0549"' : 'data-target="#xs-injectables-links-module-StoryModule-258f35285daf10d83892955d474c0549"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StoryModule-258f35285daf10d83892955d474c0549"' :
                                        'id="xs-injectables-links-module-StoryModule-258f35285daf10d83892955d474c0549"' }>
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
                                            'data-target="#controllers-links-module-UserModule-c8e28c2905b07350085f8244725fac4d"' : 'data-target="#xs-controllers-links-module-UserModule-c8e28c2905b07350085f8244725fac4d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-c8e28c2905b07350085f8244725fac4d"' :
                                            'id="xs-controllers-links-module-UserModule-c8e28c2905b07350085f8244725fac4d"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-c8e28c2905b07350085f8244725fac4d"' : 'data-target="#xs-injectables-links-module-UserModule-c8e28c2905b07350085f8244725fac4d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-c8e28c2905b07350085f8244725fac4d"' :
                                        'id="xs-injectables-links-module-UserModule-c8e28c2905b07350085f8244725fac4d"' }>
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
                                <a href="classes/AppCache.html" data-type="entity-link">AppCache</a>
                            </li>
                            <li class="link">
                                <a href="classes/CacheObject.html" data-type="entity-link">CacheObject</a>
                            </li>
                            <li class="link">
                                <a href="classes/Currency.html" data-type="entity-link">Currency</a>
                            </li>
                            <li class="link">
                                <a href="classes/Disclaimer.html" data-type="entity-link">Disclaimer</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorCodes.html" data-type="entity-link">ErrorCodes</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorResult.html" data-type="entity-link">ErrorResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/HiringType.html" data-type="entity-link">HiringType</a>
                            </li>
                            <li class="link">
                                <a href="classes/KeyValuePair.html" data-type="entity-link">KeyValuePair</a>
                            </li>
                            <li class="link">
                                <a href="classes/Listing.html" data-type="entity-link">Listing</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListingFollower.html" data-type="entity-link">ListingFollower</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListingReview.html" data-type="entity-link">ListingReview</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListingType.html" data-type="entity-link">ListingType</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalizedCurrency.html" data-type="entity-link">LocalizedCurrency</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalizedDisclaimer.html" data-type="entity-link">LocalizedDisclaimer</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalizedHiringType.html" data-type="entity-link">LocalizedHiringType</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalizedListingType.html" data-type="entity-link">LocalizedListingType</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalizedPriceType.html" data-type="entity-link">LocalizedPriceType</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginUserDto.html" data-type="entity-link">LoginUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoDataResult.html" data-type="entity-link">NoDataResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotFoundResult.html" data-type="entity-link">NotFoundResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationResult.html" data-type="entity-link">OperationResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordRecoveryToken.html" data-type="entity-link">PasswordRecoveryToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/PriceType.html" data-type="entity-link">PriceType</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterUser.html" data-type="entity-link">RegisterUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/Result.html" data-type="entity-link">Result</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchListingDto.html" data-type="entity-link">SearchListingDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchResultDto.html" data-type="entity-link">SearchResultDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchStoryDto.html" data-type="entity-link">SearchStoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Story.html" data-type="entity-link">Story</a>
                            </li>
                            <li class="link">
                                <a href="classes/SuccessResult.html" data-type="entity-link">SuccessResult</a>
                            </li>
                            <li class="link">
                                <a href="classes/ToggleUserFollowDto.html" data-type="entity-link">ToggleUserFollowDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDto.html" data-type="entity-link">UserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserFollower.html" data-type="entity-link">UserFollower</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserSnippetDto.html" data-type="entity-link">UserSnippetDto</a>
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
                                    <a href="injectables/FireBase.html" data-type="entity-link">FireBase</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MailManager.html" data-type="entity-link">MailManager</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ValidationPipe.html" data-type="entity-link">ValidationPipe</a>
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
                                <a href="interfaces/CreateListingDto.html" data-type="entity-link">CreateListingDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateStoryDto.html" data-type="entity-link">CreateStoryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurrencyAttributes.html" data-type="entity-link">CurrencyAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CurrencyDto.html" data-type="entity-link">CurrencyDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DisclaimerAttributes.html" data-type="entity-link">DisclaimerAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DisclaimerDto.html" data-type="entity-link">DisclaimerDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HiringTypeAttributes.html" data-type="entity-link">HiringTypeAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/HiringTypeDto.html" data-type="entity-link">HiringTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGoogleProfile.html" data-type="entity-link">IGoogleProfile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListingAttributes.html" data-type="entity-link">ListingAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListingDto.html" data-type="entity-link">ListingDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListingFollowerAttributes.html" data-type="entity-link">ListingFollowerAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListingReviewAttributes.html" data-type="entity-link">ListingReviewAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListingReviewDto.html" data-type="entity-link">ListingReviewDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListingReviewDto-1.html" data-type="entity-link">ListingReviewDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListingTypeAttributes.html" data-type="entity-link">ListingTypeAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListingTypeDto.html" data-type="entity-link">ListingTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocalizedCurrencyAttributes.html" data-type="entity-link">LocalizedCurrencyAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocalizedDisclaimerAttributes.html" data-type="entity-link">LocalizedDisclaimerAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocalizedHiringTypeAttributes.html" data-type="entity-link">LocalizedHiringTypeAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocalizedListingTypeAttributes.html" data-type="entity-link">LocalizedListingTypeAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocalizedPriceTypeAttributes.html" data-type="entity-link">LocalizedPriceTypeAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PasswordRecoveryTokenAttributes.html" data-type="entity-link">PasswordRecoveryTokenAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PriceTypeAttributes.html" data-type="entity-link">PriceTypeAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PriceTypeDto.html" data-type="entity-link">PriceTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResetPassword.html" data-type="entity-link">ResetPassword</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StoryAttributes.html" data-type="entity-link">StoryAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StoryDto.html" data-type="entity-link">StoryDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ToggleListingFollowDto.html" data-type="entity-link">ToggleListingFollowDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAttributes.html" data-type="entity-link">UserAttributes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserFollowerAttributes.html" data-type="entity-link">UserFollowerAttributes</a>
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
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
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