import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Listing from '../models/Listing';
import CreateListingDto from './dto/CreateListing.dto';
import ListingDto from './dto/Listing.dto';
import { LookupsService } from './../lookups/lookups.service';
import { UserService } from '@/user/user.service';
import OperationResult from './../shared/models/OperationResult';
import {
  DeepLinkShareRoutes,
  ErrorCodes,
  MessageCodes,
} from '@/shared/constants';
import SearchListingDto from './dto/SearchListingDto';
import SearchResultDto from '@/shared/models/SearchResultDto';
import Story from '@/models/Story';
import CreateListingReviewDto from './dto/CreateListingReviewDto';
import ListingReviewDto from './dto/ListingReviewDto';
import ListingReview from '@/models/ListingReview';
import ToggleListingFollowDto from './dto/ToggleListingFollowDto';
import { PrismaService } from '@/shared/core/prisma.service';
import UpdateListingDto from './dto/UpdateListing.dto';
import { LocalizationService } from '@/shared/core/localization.service';
import FireBaseService from '@/shared/core/FireBase.service';
import { StoryService } from '@/story/story.service';

@Injectable()
export class ListingService {
  constructor(
    private storyService: StoryService,
    private lookupsService: LookupsService,
    private userService: UserService,
    private readonly db: PrismaService,
    private readonly i18n: LocalizationService,
    private firebaseService: FireBaseService,
  ) {}

  public async getAllListings(
    lang: string,
    pageIndex: number,
    pageSize: number,
    myId: number,
  ): Promise<OperationResult> {
    const listings = await this.db.listings.findMany({
      where: {
        status: 0,
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: 'desc',
      },
    });

    const userFollowedListings = await this.getUserFollowedListingIds(myId);

    //return listingDtos;
    let result: ListingDto[] = [];
    // to to it in async way for performance
    const promisesArr = [];
    for (const listing of listings) {
      promisesArr.push(
        this.mapListing(listing, lang, myId, userFollowedListings),
      );
    }
    result = await Promise.all(promisesArr);
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }

  public async getListingsByIds(
    lang: string,
    ids: number[],
    myId: number,
    pageIndex: number,
    pageSize: number,
  ): Promise<ListingDto[]> {
    const userFollowedListings = await this.getUserFollowedListingIds(myId);

    const listings = await this.db.listings.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: 'desc',
      },
    });
    //return listingDtos;
    let result: ListingDto[] = [];
    // to to it in async way for performance
    const promisesArr = [];
    for (const listing of listings) {
      promisesArr.push(
        this.mapListing(listing, lang, myId, userFollowedListings),
      );
    }
    result = await Promise.all(promisesArr);
    return result;
  }

  public async addListing(
    lang: string,
    listingData: CreateListingDto,
    myId: number,
  ): Promise<OperationResult> {
    const listing = await this.db.listings.create({
      data: {
        ...listingData,
        ownerId: myId,
      },
    });

    const result = await this.mapListing(listing, lang, myId);
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }

  public async updateListing(
    lang: string,
    listingId: number,
    listingDataToUpdate: UpdateListingDto,
    myId: number,
  ): Promise<OperationResult> {
    const dbList = await this.db.listings.findUnique({
      where: {
        id: listingId,
      },
    });
    if (!dbList) {
      throw new NotFoundException(ErrorCodes.STORY_NOT_FOUND);
    }

    if (dbList.ownerId != myId) {
      throw new ForbiddenException(
        ErrorCodes.YOU_ARE_NOT_ALLOWED_TO_EDIT_THIS_RESOURCE,
      );
    }
    //// new fields that will update
    const updateFields = Object.keys(listingDataToUpdate);
    const list = await this.db.listings.update({
      where: {
        id: dbList.id,
      },
      data: {
        ...listingDataToUpdate,
        updatedFields: updateFields,
        isEdited: true,
      },
    });

    return this.getOneListingById(dbList.id, lang, myId);
  }
  public async getOneListingById(
    id: number,
    lang: string,
    myId: number,
  ): Promise<OperationResult> {
    const listing = await this.db.listings.findUnique({
      where: {
        id: id,
      },
    });
    // let userReviews: number[] = [];

    const userFollowedListings = await this.getUserFollowedListingIds(myId);

    const result = await this.mapListing(
      listing,
      lang,
      myId,
      userFollowedListings,
    );
    // update view count
    await this.db.listings.update({
      where: {
        id: listing.id,
      },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }

  public async deleteListing(
    myId: number,
    listingId: number,
  ): Promise<OperationResult> {
    const dbList = await this.db.listings.findUnique({
      where: {
        id: listingId,
      },
    });
    if (!dbList) {
      throw new NotFoundException(ErrorCodes.LISTING_NOT_FOUND);
    }

    if (dbList.ownerId != myId) {
      throw new ForbiddenException(
        ErrorCodes.YOU_ARE_NOT_ALLOWED_TO_EDIT_THIS_RESOURCE,
      );
    }
    const stories = await this.db.story.findFirst({
      where: {
        ownerId: myId,
      },
    });
    if (stories) {
      throw new BadRequestException(
        'you must delete all stories related to this product first',
      );
    } else {
      await this.db.listings.delete({
        where: {
          id: listingId,
        },
      });
    }
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    return res;
  }

  public async shareListing(id: number) {
    const dbListing = await this.db.listings.findUnique({
      where: {
        id: id,
      },
    });

    if (!dbListing) {
      throw new NotFoundException(ErrorCodes.STORY_NOT_FOUND);
    }
    const result = await this.firebaseService.getFirebaseDynamicLink(
      DeepLinkShareRoutes.product,
      { resourceId: dbListing.id },
    );
    /// increase share count by one
    await this.db.listings.update({
      where: {
        id: dbListing.id,
      },
      data: {
        shareCount: {
          increment: 1,
        },
      },
    });
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }
  async toggleFollowListing(listingId: number, myId: number) {
    const isAlreadyFollower = await this.db.listingFollowers.findFirst({
      where: {
        listingId: listingId,
        userId: myId,
      },
    });

    if (isAlreadyFollower) {
      await this.db.listingFollowers.delete({
        where: {
          id: isAlreadyFollower.id,
        },
      });
      /// decrease follow count by one
      await this.db.listings.update({
        where: {
          id: listingId,
        },
        data: {
          followCount: {
            decrement: 1,
          },
        },
      });
    } else {
      /// increase follow count by one
      await this.db.listingFollowers.create({
        data: {
          listingId: listingId,
          userId: myId,
        },
      });
      await this.db.listings.update({
        where: {
          id: listingId,
        },
        data: {
          followCount: {
            increment: 1,
          },
        },
      });

      /// @ queue , add to notifications queue
    }
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    return res;
  }
  async getAllLStoriesOfListing(
    lang: string,
    pageIndex: number,
    pageSize: number,
    myId: number,
    listingId: number,
  ) {
    const storiesOfListing = await this.db.story.findMany({
      where: {
        listingId: listingId,
      },
      select: {
        id: true,
      },
    });
    const storiesOfListingIds = storiesOfListing.map((e) => e.id);

    return this.storyService.getStoriesByIds(
      lang,
      storiesOfListingIds,
      myId,
      pageIndex,
      pageSize,
    );
  }
  /// this endpoind dropdown should show in create story feature product
  async getFeatureListings(myId: number) {
    const result = await this.db.listings.findMany({
      where: {
        ownerId: myId,
      },
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        name: true,
      },
    });

    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }
  // public async searchListings(
  //   searchModel: SearchListingDto,
  //   lang: string,
  //   userId?: number,
  // ): Promise<SearchResultDto<ListingDto>> {
  //   const where: any = {};
  //   if (searchModel.freeText && searchModel.freeText !== '') {
  //     where.name = { [Op.like]: `%${searchModel.freeText}%` };
  //   }
  //   if (searchModel.followerId && searchModel.followerId !== '') {
  //     where.id = {
  //       [Op.in]: sequelize.literal(
  //         `(SELECT "listingId"::uuid FROM "listing_followers" WHERE "userId" = :followerId)`,
  //       ),
  //     };
  //   }
  //   if (searchModel.ownerId && searchModel.ownerId !== '') {
  //     where.ownerId = searchModel.ownerId;
  //   }
  //   if (searchModel.pageType && searchModel.pageType !== '') {
  //     where.pageType = searchModel.pageType;
  //   }
  //   if (searchModel.status != undefined) {
  //     where.status = searchModel.status;
  //   }
  //   if (searchModel.listingTypeId && searchModel.listingTypeId !== '') {
  //     where.listingTypeId = searchModel.listingTypeId;
  //   }

  //   // const listings = await Listing.findAndCountAll({
  //   //   where: where,
  //   //   offset: ((searchModel.pageIndex || 1) - 1) * (searchModel.pageSize || 10),
  //   //   limit: searchModel.pageSize,
  //   //   order: [['createdAt', 'DESC']],
  //   //   replacements: {
  //   //     followerId: searchModel.followerId,
  //   //   },
  //   // });
  //   const listings = await this.db.listings.findMany({
  //     where: where,
  //   });
  //   const result = new SearchResultDto<ListingDto>();
  //   result.count = listings.length;
  //   if (result.count > 0) {
  //     let userReviews: number[] = [];
  //     let userFollowedListings: number[] = [];
  //     if (userId && listings.length > 0) {
  //       const listingIds = listings.map((r) => r.id);
  //       userReviews = await this.getUserReviewedListingIds(userId, listingIds);
  //       userFollowedListings = await this.getUserFollowedListingIds(
  //         userId,
  //         listingIds,
  //       );
  //     }
  //     for (const listing of listings) {
  //       result.data.push(
  //         await this.mapListing(
  //           listing,
  //           lang,
  //           userReviews,
  //           userFollowedListings,
  //         ),
  //       );
  //     }
  //   }
  //   return result;
  // }

  // public async upsertReview(_reviewModel: CreateListingReviewDto) {
  //   // const existingReview = await ListingReview.findOne({
  //   //   where: {
  //   //     userId: reviewModel.userId,
  //   //     listingId: reviewModel.listingId,
  //   //   },
  //   // });
  //   // const listing = await Listing.findOne({
  //   //   where: {
  //   //     id: reviewModel.listingId,
  //   //   },
  //   // });
  //   // const user = await User.findOne({
  //   //   where: {
  //   //     id: reviewModel.userId,
  //   //   },
  //   // });
  //   // if (existingReview) {
  //   //   await ListingReview.update(
  //   //     {
  //   //       goodAboutListing: reviewModel.goodAboutListing,
  //   //       notGoodAboutListing: reviewModel.notGoodAboutListing,
  //   //       starRating: reviewModel.starRating,
  //   //       title: reviewModel.title,
  //   //       reviewText: reviewModel.reviewText,
  //   //     },
  //   //     {
  //   //       where: {
  //   //         userId: reviewModel.userId,
  //   //         listingId: reviewModel.listingId,
  //   //       },
  //   //     },
  //   //   );
  //   //   //Replace current rating of the user in 2 steps:
  //   //   //1-Subtract current user rating
  //   //   let newTotalReviews = (listing?.totalRatingCount ?? 0) - 1;
  //   //   newTotalReviews = newTotalReviews < 0 ? 0 : newTotalReviews;
  //   //   let overallRating =
  //   //     newTotalReviews == 0
  //   //       ? 0
  //   //       : ((listing?.overallRating ?? 0) * (listing?.totalRatingCount ?? 0) -
  //   //           existingReview.starRating) /
  //   //         newTotalReviews;
  //   //   //2-Then again add the user rating
  //   //   overallRating =
  //   //     (overallRating * newTotalReviews + reviewModel.starRating) /
  //   //     (newTotalReviews + 1);
  //   //   await Listing.update(
  //   //     {
  //   //       overallRating: overallRating,
  //   //       totalRatingCount: newTotalReviews + 1,
  //   //     },
  //   //     {
  //   //       where: {
  //   //         id: reviewModel.listingId,
  //   //       },
  //   //     },
  //   //   );
  //   //   return {
  //   //     id: reviewModel.id,
  //   //     userId: reviewModel.userId,
  //   //     listingId: reviewModel.listingId,
  //   //     title: reviewModel.title,
  //   //     goodAboutListing: reviewModel.goodAboutListing,
  //   //     notGoodAboutListing: reviewModel.notGoodAboutListing,
  //   //     reviewText: reviewModel.reviewText,
  //   //     starRating: reviewModel.starRating,
  //   //     createdAt: existingReview.createdAt,
  //   //     updatedAt: existingReview.updatedAt,
  //   //     userName: user?.name || '',
  //   //   };
  //   // } else {
  //   //   reviewModel.id = v4();
  //   //   const newReview = await ListingReview.create(reviewModel);
  //   //   const newTotalReviews = (listing?.totalRatingCount ?? 0) + 1;
  //   //   const overallRating =
  //   //     ((listing?.overallRating ?? 0) * (listing?.totalRatingCount ?? 0) +
  //   //       reviewModel.starRating) /
  //   //     newTotalReviews;
  //   //   await Listing.update(
  //   //     {
  //   //       overallRating: overallRating,
  //   //       totalRatingCount: newTotalReviews,
  //   //     },
  //   //     {
  //   //       where: {
  //   //         id: reviewModel.listingId,
  //   //       },
  //   //     },
  //   //   );
  //   //   return {
  //   //     id: newReview.id,
  //   //     userId: newReview.userId,
  //   //     listingId: newReview.listingId,
  //   //     title: newReview.title,
  //   //     goodAboutListing: newReview.goodAboutListing,
  //   //     notGoodAboutListing: newReview.notGoodAboutListing,
  //   //     reviewText: newReview.reviewText,
  //   //     starRating: newReview.starRating,
  //   //     createdAt: newReview.createdAt,
  //   //     updatedAt: newReview.updatedAt,
  //   //     userName: user?.name || '',
  //   //   };
  //   // }
  // }

  // public async deleteReview(
  //   _userId: number,
  //   _reviewId: number,
  //   _listingId: number,
  // ): Promise<OperationResult> {
  //   const result = new OperationResult();
  //   try {
  //     // const existingReview = await ListingReview.findOne({
  //     //   where: {
  //     //     id: reviewId,
  //     //     userId: userId,
  //     //   },
  //     // });
  //     // if (existingReview && existingReview.listingId === listingId) {
  //     //   const listing = await Listing.findOne({
  //     //     where: {
  //     //       id: existingReview.listingId,
  //     //     },
  //     //   });
  //     //   await ListingReview.destroy({
  //     //     where: {
  //     //       id: reviewId,
  //     //     },
  //     //   });
  //     //   let newTotalReviews = (listing?.totalRatingCount ?? 0) - 1;
  //     //   newTotalReviews = newTotalReviews < 0 ? 0 : newTotalReviews;
  //     //   const overallRating =
  //     //     newTotalReviews == 0
  //     //       ? 0
  //     //       : ((listing?.overallRating ?? 0) *
  //     //           (listing?.totalRatingCount ?? 0) -
  //     //           existingReview.starRating) /
  //     //         newTotalReviews;
  //     //   await Listing.update(
  //     //     {
  //     //       overallRating: overallRating,
  //     //       totalRatingCount: newTotalReviews,
  //     //     },
  //     //     {
  //     //       where: {
  //     //         id: existingReview.listingId,
  //     //       },
  //     //     },
  //     //   );
  //     //   result.success = true;
  //     // } else {
  //     //   result.success = false;
  //     //   result.code = ErrorCodes.NOT_FOUND;
  //     // }
  //   } catch (error) {
  //     result.success = false;
  //     result.code = ErrorCodes.GENERAL_ERROR;
  //     result.message = error;
  //   }
  //   return result;
  // }

  // public async getListingReviews(
  //   listingId: number,
  //   pageIndex: number,
  //   pageSize: number,
  // ): Promise<SearchResultDto<ListingReviewDto>> {
  //   const reviews = await ListingReview.findAndCountAll({
  //     where: {
  //       listingId: listingId,
  //     },
  //     offset: ((pageIndex || 1) - 1) * (pageSize || 10),
  //     limit: pageSize,
  //     order: [['createdAt', 'DESC']],
  //   });
  //   const result = new SearchResultDto<ListingReviewDto>();
  //   result.count = 0;
  //   if (reviews.count > 0) {
  //     result.count = reviews.count;
  //     const users = [];
  //     // await this.userService.getUsers(
  //     //   reviews.rows.map((review) => review.userId),
  //     // );
  //     result.data = reviews.rows.map((review) => {
  //       const reviewDto: ListingReviewDto = {
  //         id: review.id,
  //         userId: review.userId,
  //         listingId: review.listingId,
  //         userName: users?.find((u) => u.id === review.userId)?.name ?? '',
  //         title: review.title,
  //         goodAboutListing: review.goodAboutListing,
  //         notGoodAboutListing: review.notGoodAboutListing,
  //         reviewText: review.reviewText,
  //         starRating: review.starRating,
  //         createdAt: review.createdAt,
  //         updatedAt: review.updatedAt,
  //       };
  //       return reviewDto;
  //     });
  //   }
  //   return result;
  // }

  // public async toggleListingFollow(
  //   _toggleModel: ToggleListingFollowDto,
  // ): Promise<OperationResult> {
  //   const result = new OperationResult();
  //   try {
  //     // const existingFollower = await ListingFollower.findOne({
  //     //   where: {
  //     //     userId: toggleModel.userId,
  //     //     listingId: toggleModel.listingId,
  //     //   },
  //     // });
  //     // if (!existingFollower && toggleModel.isFollowed === true) {
  //     //   await ListingFollower.create({
  //     //     id: v4(),
  //     //     userId: toggleModel.userId,
  //     //     listingId: toggleModel.listingId,
  //     //   });
  //     // } else if (existingFollower && toggleModel.isFollowed === false) {
  //     //   await ListingFollower.destroy({
  //     //     where: {
  //     //       id: existingFollower.id,
  //     //     },
  //     //   });
  //     // }
  //     // result.success = true;
  //   } catch (error) {
  //     result.success = false;
  //     result.message = error;
  //   }
  //   return result;
  // }

  // public async getUserReviewedListingIds(
  //   userId: number,
  //   listingIds: number[],
  // ): Promise<Array<number>> {
  //   const reviews = await this.db.listingReviews.findMany({
  //     where: {
  //       userId: userId,
  //       listingId: {
  //         in: listingIds,
  //       },
  //     },
  //   });

  //   return reviews.map((r) => r.listingId);
  // }

  public async getUserFollowedListingIds(
    userId: number,
  ): Promise<Array<number>> {
    const listings = await this.db.listingFollowers.findMany({
      where: {
        userId: userId,
      },
    });
    return listings.map((r) => r.listingId);
  }

  async mapListing(
    listing: any,
    lang: string,
    myId: number,
    // userReviews: number[] = [],
    userFollowedListings: number[] = [],
  ): Promise<ListingDto> {
    const [
      { data: user },
      { data: privacy },
      { data: listingTypes },
      { data: priceTypes },
      { data: currencies },
      { data: hiringTypes },
      { data: pageTypes },
      { data: stockAvailability },
      { data: brandType },
    ] = await Promise.all([
      this.userService.getUser(listing.ownerId, myId),
      this.lookupsService.getPrivacy(lang),
      this.lookupsService.getAllListingTypes(lang),
      this.lookupsService.getPriceTypes(lang),
      this.lookupsService.getCurrencies(lang),
      this.lookupsService.getHiringTypes(lang),
      this.lookupsService.getPageType(lang),
      this.lookupsService.getStockAvailability(lang),
      this.lookupsService.getBrandType(lang),
    ]);

    const result = {
      id: listing.id,
      type: 'Listing',
      name: listing.name,
      brandName: listing.brandName,
      description: listing.description,
      credentials: listing.credentials,
      advantages: listing.advantages,
      uses: listing.uses,
      url: listing.url,
      price: listing.price,
      media: listing.media,
      socialLinks: listing.socialLinks,
      updatedFields: listing.updatedFields,
      status: listing.status,
      ownerId: listing.ownerId,
      owner: user,

      offerPrice: listing.offerPrice,
      offerDescription: listing.offerDescription,
      otherStockAvailability: listing.otherStockAvailability,
      otherPriceType: listing.otherPriceType,
      otherHiring: listing.otherHiring,

      overallRating: listing.overallRating,
      totalRatingCount: listing.totalRatingCount,
      viewsCount: listing.viewsCount,
      followCount: listing.followCount,
      storiesCount: listing.storiesCount,
      shareCount: listing.shareCount,
      isEdited: listing.isEdited,
      isRepublished: listing.isRepublished,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      /// userfolloed list is the products that user are follow
      isFollowed: userFollowedListings.some((listId) => listId == listing.id),

      stockAvailability:
        stockAvailability.find((lt) => lt.id === listing.stockAvailabilityId) ||
        null,

      pageType: pageTypes.find((lt) => lt.id === listing.pageTypeId) || null,

      privacy: privacy.find((lt) => lt.id === listing.privacyId) || null,

      listingType:
        listingTypes.find((lt) => lt.id === listing.listingTypeId) || null,

      currency: currencies.find((c) => c.id === listing.currencyId) || null,

      hiringType:
        hiringTypes.find((ht) => ht.id === listing.hiringTypeId) || null,

      priceType: priceTypes.find((pt) => pt.id === listing.priceTypeId) || null,

      brandType: brandType.find((pt) => pt.id === listing.brandTypeId) || null,

      // isReviewed: userReviews.find((listingId) => listingId === listing.id)
      //   ? true
      //   : false,
      // isFollowed: userFollowedListings.find(
      //   (listingId) => listingId === listing.id,
      // )
      //   ? true
      //   : false,
    };
    // if (
    //   result.offerPrice &&
    //   result.offerPrice > 0 &&
    //   result.priceTypeFormat != ''
    // ) {
    //   result.priceTypeFormat = result.priceTypeFormat.replace(
    //     '*PRICE *CURRENCY',
    //     '<line>*PRICE *CURRENCY</line>',
    //   );
    // }

    return result;
  }

  // async mapListings(
  //   listings: any[],
  //   lang: string,
  //   userReviews: string[] = [],
  //   userFollowedListings: string[] = [],
  // ): Promise<ListingDto[]> {
  //   const listingTypes = await this.lookupsService.getAllListingTypes(lang);
  //   const priceTypes = await this.lookupsService.getPriceTypes(lang);
  //   const currencies = await this.lookupsService.getCurrencies(lang);
  //   const users = [];
  //   // await this.userService.getUsers(
  //   //   listings.map((listing) => listing.ownerId),
  //   // );
  //   const hiringTypes = await this.lookupsService.getHiringTypes(lang);

  //   return listings.map((listing) => {
  //     const listingDto = {
  //       id: listing.id,
  //       type: 'Listing',
  //       ownerId: listing.ownerId,
  //       owner: users?.find((user) => user.id === listing.ownerId),
  //       pageType: listing.pageType,
  //       listingTypeId: listing.listingTypeId,
  //       listingTypeName:
  //         listingTypes.find((lt) => lt.id === listing.listingTypeId)?.name ||
  //         '',
  //       privacy: listing.privacy,
  //       media: listing.media,
  //       name: listing.name,
  //       brandName: listing.brandName,
  //       description: listing.description,
  //       credentials: listing.credentials,
  //       uses: listing.uses,
  //       stockAvailability: listing.stockAvailability,
  //       advantages: listing.advantages,
  //       url: listing.url,
  //       price: listing.price,
  //       priceTypeId: listing.priceTypeId,
  //       otherPriceType: listing.otherPriceType,
  //       priceTypeName:
  //         priceTypes.find((pt) => pt.id === listing.priceTypeId)?.name || '',
  //       priceTypeFormat:
  //         priceTypes.find((pt) => pt.id === listing.priceTypeId)?.format || '',
  //       currencyId: listing.currencyId,
  //       currencyName:
  //         currencies.find((c) => c.id === listing.currencyId)?.name || '',
  //       currencySymbol:
  //         currencies.find((c) => c.id === listing.currencyId)?.symbol || '',
  //       currencyStandardCode:
  //         currencies.find((c) => c.id === listing.currencyId)?.standardCode ||
  //         '',
  //       hiringTypeId: listing.hiringTypeId,
  //       hiringTypeName:
  //         hiringTypes.find((ht) => ht.id === listing.hiringTypeId)?.name || '',
  //       otherHiring: listing.otherHiring,
  //       offerPrice: listing.offerPrice,
  //       offerDescription: listing.offerDescription,
  //       socialLinks: listing.socialLinks,
  //       viewsCount: listing.viewsCount,
  //       status: listing.status,
  //       createdAt: listing.createdAt,
  //       updatedAt: listing.updatedAt,
  //       isEdited: listing.isEdited,
  //       avgReviews: listing.overallRating.toFixed(2),
  //       reviewsCount: listing.totalRatingCount,
  //       isReviewed: userReviews.find((listingId) => listingId === listing.id)
  //         ? true
  //         : false,
  //       isFollowed: userFollowedListings.find(
  //         (listingId) => listingId === listing.id,
  //       )
  //         ? true
  //         : false,
  //     };

  //     if (
  //       listingDto.offerPrice &&
  //       listingDto.offerPrice > 0 &&
  //       listingDto.priceTypeFormat != ''
  //     ) {
  //       listingDto.priceTypeFormat = listingDto.priceTypeFormat.replace(
  //         '*PRICE *CURRENCY',
  //         '<line>*PRICE *CURRENCY</line>',
  //       );
  //     }

  //     return listingDto;
  //   });
  // }
}
