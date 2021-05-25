import { Injectable } from '@nestjs/common';
import Listing from '../models/Listing';
import CreateListingDto from './dto/CreateListingDto';
import ListingDto from './dto/ListingDto';
import { LookupsService } from './../lookups/lookups.service';
import { UserService } from '@/user/user.service';
import OperationResult from './../shared/models/OperationResult';
import { ErrorCodes } from '@/shared/constants';
import SearchListingDto from './dto/SearchListingDto';
import { Op } from 'sequelize';
import SearchResultDto from '@/shared/models/SearchResultDto';
import Story from '@/models/Story';
import CreateListingReviewDto from './dto/CreateListingReviewDto';
import ListingReviewDto from './dto/ListingReviewDto';
import ListingReview from '@/models/ListingReview';
import User from '@/models/User';
import { v4 } from 'uuid';
import ToggleListingFollowDto from './dto/ToggleListingFollowDto';
import ListingFollower from './../models/ListingFollower';
import sequelize from 'sequelize';

@Injectable()
export class ListingService {
  constructor(
    private lookupsService: LookupsService,
    private userService: UserService,
  ) {}

  public async addListing(
    lang: string,
    listingData: CreateListingDto,
  ): Promise<ListingDto> {
    listingData.overallRating = 0;
    listingData.totalRatingCount = 0;
    const listing = await Listing.create(listingData);
    return this.mapListing(listing, lang);
  }

  public async updateListing(
    id: string,
    lang: string,
    listingData: CreateListingDto,
  ): Promise<ListingDto> {
    await Listing.update(listingData, {
      where: {
        id: id,
      },
    });
    const listing = await this.getListing(id, lang);
    return this.mapListing(listing, lang);
  }

  public async getAllListings(lang: string): Promise<ListingDto[]> {
    const listings = await Listing.findAll({
      order: [['createdAt', 'DESC']],
    });
    const listingDtos: ListingDto[] = [];
    for (const listing of listings) {
      listingDtos.push(await this.mapListing(listing, lang));
    }
    return listingDtos;
  }

  public async getListingsByIds(
    lang: string,
    ids: string[],
  ): Promise<ListingDto[]> {
    const listings = await Listing.findAll({
      where: {
        id: ids,
      },
    });
    return this.mapListings(listings, lang);
  }

  public async getListing(
    id: string,
    lang: string,
    userId?: string,
  ): Promise<ListingDto | null> {
    const listing = await Listing.findOne({
      where: {
        id: id,
      },
    });
    let userReviews: string[] = [];
    let userFollowedListings: string[] = [];
    if (userId && listing) {
      userReviews = await this.getUserReviewedListingIds(userId, [listing.id]);
      userFollowedListings = await this.getUserFollowedListingIds(userId, [
        listing.id,
      ]);
    }
    return await this.mapListing(
      listing,
      lang,
      userReviews,
      userFollowedListings,
    );
  }

  public async deleteListing(
    ownerId: string,
    id: string,
  ): Promise<OperationResult> {
    const result = new OperationResult();
    try {
      const listing = await Listing.findOne({
        where: {
          id: id,
          ownerId: ownerId,
        },
      });
      if (!listing) {
        result.success = false;
        result.code = ErrorCodes.NOT_FOUND;
      } else {
        const stories = await Story.findAll({
          where: {
            listingId: listing.id,
          },
        });
        //Remove the listing from template and draft stories
        const templateStories = stories.filter(
          (s) =>
            s.status === 0 /* draft */ ||
            s.status === 2 /* user template*/ ||
            s.status === 3 /* example template */,
        );
        console.log('Tempalte stories', templateStories);
        for (const templateStory of templateStories) {
          await Story.update(
            { listingId: null },
            {
              where: {
                id: templateStory.id,
              },
            },
          );
        }
        //Reject deletion in case a published story were linked the listing
        const publishedStories = stories.filter(
          (s) => s.status === 1 /* published */,
        );
        if (publishedStories && publishedStories.length > 0) {
          result.success = false;
          result.code = ErrorCodes.LISTING_HAVE_STORIES;
        } else {
          const mediaFiles = listing.media;
          if (mediaFiles) {
            for (const media of mediaFiles) {
              if (media.bucket && media.type && media.fileName)
                this.lookupsService.deleteFile(
                  media.bucket,
                  media.type,
                  media.fileName,
                );
            }
          }
          await Listing.destroy({
            where: {
              id: id,
              ownerId: ownerId,
            },
          });
          result.success = true;
        }
      }
    } catch (error) {
      result.success = false;
      result.code = ErrorCodes.GENERAL_ERROR;
      result.message = error;
    }
    return result;
  }

  public async searchListings(
    searchModel: SearchListingDto,
    lang: string,
    userId?: string,
  ): Promise<SearchResultDto<ListingDto>> {
    const where: any = {};
    if (searchModel.freeText && searchModel.freeText !== '') {
      where.name = { [Op.like]: `%${searchModel.freeText}%` };
    }
    if (searchModel.followerId && searchModel.followerId !== '') {
      where.id = {
        [Op.in]: sequelize.literal(
          `(SELECT "listingId"::uuid FROM "listing_followers" WHERE "userId" = :followerId)`,
        ),
      };
    }
    if (searchModel.ownerId && searchModel.ownerId !== '') {
      where.ownerId = searchModel.ownerId;
    }
    if (searchModel.pageType && searchModel.pageType !== '') {
      where.pageType = searchModel.pageType;
    }
    if (searchModel.status != undefined) {
      where.status = searchModel.status;
    }
    if (searchModel.listingTypeId && searchModel.listingTypeId !== '') {
      where.listingTypeId = searchModel.listingTypeId;
    }

    const listings = await Listing.findAndCountAll({
      where: where,
      offset: ((searchModel.pageIndex || 1) - 1) * (searchModel.pageSize || 10),
      limit: searchModel.pageSize,
      order: [['createdAt', 'DESC']],
      replacements: {
        followerId: searchModel.followerId,
      },
    });
    const result = new SearchResultDto<ListingDto>();
    result.count = listings.count;
    if (result.count > 0) {
      let userReviews: string[] = [];
      let userFollowedListings: string[] = [];
      if (userId && listings.count > 0) {
        const listingIds = listings.rows.map((r) => r.id);
        userReviews = await this.getUserReviewedListingIds(userId, listingIds);
        userFollowedListings = await this.getUserFollowedListingIds(
          userId,
          listingIds,
        );
      }
      for (const listing of listings.rows) {
        result.data.push(
          await this.mapListing(
            listing,
            lang,
            userReviews,
            userFollowedListings,
          ),
        );
      }
    }
    return result;
  }

  public async upsertReview(
    reviewModel: CreateListingReviewDto,
  ): Promise<ListingReviewDto> {
    const existingReview = await ListingReview.findOne({
      where: {
        userId: reviewModel.userId,
        listingId: reviewModel.listingId,
      },
    });
    const listing = await Listing.findOne({
      where: {
        id: reviewModel.listingId,
      },
    });
    const user = await User.findOne({
      where: {
        id: reviewModel.userId,
      },
    });

    if (existingReview) {
      await ListingReview.update(
        {
          goodAboutListing: reviewModel.goodAboutListing,
          notGoodAboutListing: reviewModel.notGoodAboutListing,
          starRating: reviewModel.starRating,
          title: reviewModel.title,
          reviewText: reviewModel.reviewText,
        },
        {
          where: {
            userId: reviewModel.userId,
            listingId: reviewModel.listingId,
          },
        },
      );
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
      await Listing.update(
        {
          overallRating: overallRating,
          totalRatingCount: newTotalReviews + 1,
        },
        {
          where: {
            id: reviewModel.listingId,
          },
        },
      );
      return {
        id: reviewModel.id,
        userId: reviewModel.userId,
        listingId: reviewModel.listingId,
        title: reviewModel.title,
        goodAboutListing: reviewModel.goodAboutListing,
        notGoodAboutListing: reviewModel.notGoodAboutListing,
        reviewText: reviewModel.reviewText,
        starRating: reviewModel.starRating,
        createdAt: existingReview.createdAt,
        updatedAt: existingReview.updatedAt,
        userName: user?.name || '',
      };
    } else {
      reviewModel.id = v4();
      const newReview = await ListingReview.create(reviewModel);
      const newTotalReviews = (listing?.totalRatingCount ?? 0) + 1;
      const overallRating =
        ((listing?.overallRating ?? 0) * (listing?.totalRatingCount ?? 0) +
          reviewModel.starRating) /
        newTotalReviews;
      await Listing.update(
        {
          overallRating: overallRating,
          totalRatingCount: newTotalReviews,
        },
        {
          where: {
            id: reviewModel.listingId,
          },
        },
      );
      return {
        id: newReview.id,
        userId: newReview.userId,
        listingId: newReview.listingId,
        title: newReview.title,
        goodAboutListing: newReview.goodAboutListing,
        notGoodAboutListing: newReview.notGoodAboutListing,
        reviewText: newReview.reviewText,
        starRating: newReview.starRating,
        createdAt: newReview.createdAt,
        updatedAt: newReview.updatedAt,
        userName: user?.name || '',
      };
    }
  }

  public async deleteReview(
    userId: string,
    reviewId: string,
    listingId: string,
  ): Promise<OperationResult> {
    const result = new OperationResult();
    try {
      const existingReview = await ListingReview.findOne({
        where: {
          id: reviewId,
          userId: userId,
        },
      });
      if (existingReview && existingReview.listingId === listingId) {
        const listing = await Listing.findOne({
          where: {
            id: existingReview.listingId,
          },
        });

        await ListingReview.destroy({
          where: {
            id: reviewId,
          },
        });

        let newTotalReviews = (listing?.totalRatingCount ?? 0) - 1;
        newTotalReviews = newTotalReviews < 0 ? 0 : newTotalReviews;
        const overallRating =
          newTotalReviews == 0
            ? 0
            : ((listing?.overallRating ?? 0) *
                (listing?.totalRatingCount ?? 0) -
                existingReview.starRating) /
              newTotalReviews;
        await Listing.update(
          {
            overallRating: overallRating,
            totalRatingCount: newTotalReviews,
          },
          {
            where: {
              id: existingReview.listingId,
            },
          },
        );
        result.success = true;
      } else {
        result.success = false;
        result.code = ErrorCodes.NOT_FOUND;
      }
    } catch (error) {
      result.success = false;
      result.code = ErrorCodes.GENERAL_ERROR;
      result.message = error;
    }
    return result;
  }

  public async getListingReviews(
    listingId: string,
    pageIndex: number,
    pageSize: number,
  ): Promise<SearchResultDto<ListingReviewDto>> {
    const reviews = await ListingReview.findAndCountAll({
      where: {
        listingId: listingId,
      },
      offset: ((pageIndex || 1) - 1) * (pageSize || 10),
      limit: pageSize,
      order: [['createdAt', 'DESC']],
    });
    const result = new SearchResultDto<ListingReviewDto>();
    result.count = 0;
    if (reviews.count > 0) {
      result.count = reviews.count;
      const users = await this.userService.getUsers(
        reviews.rows.map((review) => review.userId),
      );
      result.data = reviews.rows.map((review) => {
        const reviewDto: ListingReviewDto = {
          id: review.id,
          userId: review.userId,
          listingId: review.listingId,
          userName: users?.find((u) => u.id === review.userId)?.name ?? '',
          title: review.title,
          goodAboutListing: review.goodAboutListing,
          notGoodAboutListing: review.notGoodAboutListing,
          reviewText: review.reviewText,
          starRating: review.starRating,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
        };
        return reviewDto;
      });
    }
    return result;
  }

  public async toggleListingFollow(
    toggleModel: ToggleListingFollowDto,
  ): Promise<OperationResult> {
    const result = new OperationResult();
    try {
      const existingFollower = await ListingFollower.findOne({
        where: {
          userId: toggleModel.userId,
          listingId: toggleModel.listingId,
        },
      });

      if (!existingFollower && toggleModel.isFollowed === true) {
        await ListingFollower.create({
          id: v4(),
          userId: toggleModel.userId,
          listingId: toggleModel.listingId,
        });
      } else if (existingFollower && toggleModel.isFollowed === false) {
        await ListingFollower.destroy({
          where: {
            id: existingFollower.id,
          },
        });
      }
      result.success = true;
    } catch (error) {
      result.success = false;
      result.message = error;
    }
    return result;
  }

  public async getUserReviewedListingIds(
    userId: string,
    listingIds: string[],
  ): Promise<Array<string>> {
    const reviews = await ListingReview.findAll({
      where: {
        userId: userId,
        listingId: listingIds,
      },
    });

    return reviews.map((r) => r.listingId);
  }

  public async getUserFollowedListingIds(
    userId: string,
    listingIds: string[],
  ): Promise<Array<string>> {
    const listings = await ListingFollower.findAll({
      where: {
        userId: userId,
        listingId: listingIds,
      },
    });

    return listings.map((r) => r.listingId);
  }

  async mapListing(
    listing: any,
    lang: string,
    userReviews: string[] = [],
    userFollowedListings: string[] = [],
  ): Promise<ListingDto> {
    const listingTypes = await this.lookupsService.getListingTypes(
      listing.pageType,
      lang,
    );
    const priceTypes = await this.lookupsService.getPriceTypes(lang);
    const currencies = await this.lookupsService.getCurrencies(lang);
    const user = await this.userService.getUser(listing.ownerId);
    const currency = currencies.find((c) => c.id === listing.currencyId);
    const hiringTypes = await this.lookupsService.getHiringTypes(lang);

    const result = {
      id: listing.id,
      type: 'Listing',
      ownerId: listing.ownerId,
      owner: user,
      pageType: listing.pageType,
      listingTypeId: listing.listingTypeId,
      listingTypeName:
        listingTypes.find((lt) => lt.id === listing.listingTypeId)?.name || '',
      privacy: listing.privacy,
      media: listing.media,
      name: listing.name,
      brandName: listing.brandName,
      description: listing.description,
      credentials: listing.credentials,
      uses: listing.uses,
      stockAvailability: listing.stockAvailability,
      advantages: listing.advantages,
      url: listing.url,
      price: listing.price,
      priceTypeId: listing.priceTypeId,
      otherPriceType: listing.otherPriceType,
      priceTypeName:
        priceTypes.find((pt) => pt.id === listing.priceTypeId)?.name || '',
      priceTypeFormat:
        priceTypes.find((pt) => pt.id === listing.priceTypeId)?.format || '',
      currencyId: listing.currencyId,
      currencyName: currency?.name || '',
      currencySymbol: currency?.symbol || '',
      currencyStandardCode: currency?.standardCode || '',
      hiringTypeId: listing.hiringTypeId,
      hiringTypeName:
        hiringTypes.find((ht) => ht.id === listing.hiringTypeId)?.name || '',
      otherHiring: listing.otherHiring,
      offerPrice: listing.offerPrice,
      offerDescription: listing.offerDescription,
      socialLinks: listing.socialLinks,
      viewsCount: listing.viewsCount,
      status: listing.status,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      isEdited: listing.isEdited,
      avgReviews: listing.overallRating.toFixed(2),
      reviewsCount: listing.totalRatingCount,
      isReviewed: userReviews.find((listingId) => listingId === listing.id)
        ? true
        : false,
      isFollowed: userFollowedListings.find(
        (listingId) => listingId === listing.id,
      )
        ? true
        : false,
    };

    if (
      result.offerPrice &&
      result.offerPrice > 0 &&
      result.priceTypeFormat != ''
    ) {
      result.priceTypeFormat = result.priceTypeFormat.replace(
        '*PRICE *CURRENCY',
        '<line>*PRICE *CURRENCY</line>',
      );
    }

    return result;
  }

  async mapListings(
    listings: any[],
    lang: string,
    userReviews: string[] = [],
    userFollowedListings: string[] = [],
  ): Promise<ListingDto[]> {
    const listingTypes = await this.lookupsService.getAllListingTypes(lang);
    const priceTypes = await this.lookupsService.getPriceTypes(lang);
    const currencies = await this.lookupsService.getCurrencies(lang);
    const users = await this.userService.getUsers(
      listings.map((listing) => listing.ownerId),
    );
    const hiringTypes = await this.lookupsService.getHiringTypes(lang);

    return listings.map((listing) => {
      const listingDto = {
        id: listing.id,
        type: 'Listing',
        ownerId: listing.ownerId,
        owner: users?.find((user) => user.id === listing.ownerId),
        pageType: listing.pageType,
        listingTypeId: listing.listingTypeId,
        listingTypeName:
          listingTypes.find((lt) => lt.id === listing.listingTypeId)?.name ||
          '',
        privacy: listing.privacy,
        media: listing.media,
        name: listing.name,
        brandName: listing.brandName,
        description: listing.description,
        credentials: listing.credentials,
        uses: listing.uses,
        stockAvailability: listing.stockAvailability,
        advantages: listing.advantages,
        url: listing.url,
        price: listing.price,
        priceTypeId: listing.priceTypeId,
        otherPriceType: listing.otherPriceType,
        priceTypeName:
          priceTypes.find((pt) => pt.id === listing.priceTypeId)?.name || '',
        priceTypeFormat:
          priceTypes.find((pt) => pt.id === listing.priceTypeId)?.format || '',
        currencyId: listing.currencyId,
        currencyName:
          currencies.find((c) => c.id === listing.currencyId)?.name || '',
        currencySymbol:
          currencies.find((c) => c.id === listing.currencyId)?.symbol || '',
        currencyStandardCode:
          currencies.find((c) => c.id === listing.currencyId)?.standardCode ||
          '',
        hiringTypeId: listing.hiringTypeId,
        hiringTypeName:
          hiringTypes.find((ht) => ht.id === listing.hiringTypeId)?.name || '',
        otherHiring: listing.otherHiring,
        offerPrice: listing.offerPrice,
        offerDescription: listing.offerDescription,
        socialLinks: listing.socialLinks,
        viewsCount: listing.viewsCount,
        status: listing.status,
        createdAt: listing.createdAt,
        updatedAt: listing.updatedAt,
        isEdited: listing.isEdited,
        avgReviews: listing.overallRating.toFixed(2),
        reviewsCount: listing.totalRatingCount,
        isReviewed: userReviews.find((listingId) => listingId === listing.id)
          ? true
          : false,
        isFollowed: userFollowedListings.find(
          (listingId) => listingId === listing.id,
        )
          ? true
          : false,
      };

      if (
        listingDto.offerPrice &&
        listingDto.offerPrice > 0 &&
        listingDto.priceTypeFormat != ''
      ) {
        listingDto.priceTypeFormat = listingDto.priceTypeFormat.replace(
          '*PRICE *CURRENCY',
          '<line>*PRICE *CURRENCY</line>',
        );
      }

      return listingDto;
    });
  }
}
