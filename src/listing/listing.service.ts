import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

import CreateListingReviewDto from './dto/CreateListingReview.dto';
import ListingReviewDto from './dto/ListingReview.dto';
import { PrismaService } from '@/shared/core/prisma.service';
import UpdateListingDto from './dto/UpdateListing.dto';
import { LocalizationService } from '@/shared/core/localization.service';
import FireBaseService from '@/shared/core/FireBase.service';
import { StoryService } from '@/story/story.service';
import { addDays, isBefore } from 'date-fns';

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

  /// new mahmoud /////////////////
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
        createdAt: 'desc',
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
      throw new NotFoundException(ErrorCodes.LISTING_NOT_FOUND);
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

    if (!listing) {
      throw new NotFoundException(ErrorCodes.LISTING_NOT_FOUND);
    }
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
    const storiesOfProduct = await this.db.story.findMany({
      where: {
        listingId: dbList.id,
      },
    });
    if (storiesOfProduct) {
      /// after client updates , delete all stories of product without warning
      // throw new BadRequestException(
      //   'you must delete all stories related to this product first',
      // );
      await this.db.story.deleteMany({
        where: {
          listingId: dbList.id,
        },
      });
    }
    await this.db.listings.delete({
      where: {
        id: listingId,
      },
    });

    /// remeber to decrease user number of stories , products count base on deletion count
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
      throw new NotFoundException(ErrorCodes.LISTING_NOT_FOUND);
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

  public async republishListing(
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

    /// listing can't be republished before 3 days from creation
    const allowedDateToRepublish = addDays(dbList.createdAt, 3);

    if (isBefore(new Date(), allowedDateToRepublish)) {
      throw new BadRequestException(
        'you cant republish before three days from creation',
      );
    } else {
      await this.db.listings.update({
        where: {
          id: listingId,
        },
        data: {
          isRepublished: true,
          /// new date to show up in top of timeline
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    return res;
  }
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
      { data: usesType },
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
      this.lookupsService.getUsesTypes(lang),
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

      overallRating: listing.overallRating.toString(),
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

      usesType: usesType.find((pt) => pt.id === listing.usesTypeId) || null,

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

  public async upsertReview(
    listingId: number,
    myId: number,
    reviewModel: CreateListingReviewDto,
  ) {
    const existingReview = await this.db.listingReviews.findFirst({
      where: {
        ownerId: myId,
        listingId: listingId,
      },
    });
    const listing = await this.db.listings.findUnique({
      where: {
        id: listingId,
      },
    });
    if (existingReview) {
      await this.db.listingReviews.update({
        where: {
          id: existingReview.id,
        },
        data: {
          ...reviewModel,
        },
      });
      //Replace current rating of the user in 2 steps:
      //1-Subtract current user rating
      let newTotalReviews = (listing?.totalRatingCount ?? 0) - 1;
      newTotalReviews = newTotalReviews < 0 ? 0 : newTotalReviews;
      let overallRating =
        newTotalReviews == 0
          ? 0
          : ((listing?.overallRating ?? 0) * (listing?.totalRatingCount ?? 0) -
              existingReview.starRating) /
            newTotalReviews;
      //2-Then again add the user rating
      overallRating =
        (overallRating * newTotalReviews + reviewModel.starRating) /
        (newTotalReviews + 1);
      await this.db.listings.update({
        where: {
          id: listingId,
        },
        data: {
          overallRating: overallRating,
          totalRatingCount: newTotalReviews + 1,
        },
      });
    } else {
      const newReview = await this.db.listingReviews.create({
        data: {
          ...reviewModel,
          listingId: listingId,
          ownerId: myId,
        },
      });
      const newTotalReviews = (listing?.totalRatingCount ?? 0) + 1;
      const overallRating =
        ((listing?.overallRating ?? 0) * (listing?.totalRatingCount ?? 0) +
          reviewModel.starRating) /
        newTotalReviews;
      await this.db.listings.update({
        where: {
          id: listingId,
        },
        data: {
          overallRating: overallRating,
          totalRatingCount: newTotalReviews,
        },
      });
    }

    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    return res;
  }

  public async deleteReview(
    listingId: number,
    myId: number,
  ): Promise<OperationResult> {
    const existingReview = await this.db.listingReviews.findFirst({
      where: {
        ownerId: myId,
        listingId: listingId,
      },
    });
    if (existingReview && existingReview.listingId === listingId) {
      const listing = await this.db.listings.findUnique({
        where: {
          id: listingId,
        },
      });
      await this.db.listingReviews.delete({
        where: {
          id: existingReview.id,
        },
      });
      let newTotalReviews = (listing?.totalRatingCount ?? 0) - 1;
      newTotalReviews = newTotalReviews < 0 ? 0 : newTotalReviews;
      const overallRating =
        newTotalReviews == 0
          ? 0
          : ((listing?.overallRating ?? 0) * (listing?.totalRatingCount ?? 0) -
              existingReview.starRating) /
            newTotalReviews;
      await this.db.listings.update({
        where: {
          id: listingId,
        },
        data: {
          overallRating: overallRating,
          totalRatingCount: newTotalReviews,
        },
      });
    }
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    return res;
  }

  public async getListingReviews(
    listingId: number,
    myId: number,
    pageIndex: number,
    pageSize: number,
  ): Promise<OperationResult> {
    const reviews = await this.db.listingReviews.findMany({
      where: {
        listingId: listingId,
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: 'desc',
      },
    });

    let result: ListingReviewDto[] = [];
    // to to it in async way for performance
    const promisesArr = [];
    for (const review of reviews) {
      promisesArr.push(this.mapReview(review, myId));
    }
    result = await Promise.all(promisesArr);

    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }

  async mapReview(review: any, myId: number): Promise<ListingReviewDto> {
    const { data: user } = await this.userService.getUser(review.ownerId, myId);
    return {
      id: review.id,
      ownerId: review.ownerId,
      owner: user,
      reviewText: review.reviewText,
      starRating: review.starRating,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

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
