import { Injectable } from '@nestjs/common';
import Story from '../models/Story';
import CreateStoryDto from './dto/CreateStoryDto';
import StoryDto from './dto/StoryDto';
import { LookupsService } from '../lookups/lookups.service';
import { UserService } from '@/user/user.service';
import OperationResult from '../shared/models/OperationResult';
import { ErrorCodes } from '@/shared/constants';
import SearchResultDto from '@/shared/models/SearchResultDto';
import SearchStoryDto from './dto/SearchStoryDto';
import { ListingService } from '@/listing/listing.service';
import ListingDto from '@/listing/dto/ListingDto';

@Injectable()
export class StoryService {
  constructor(
    private lookupsService: LookupsService,
    private userService: UserService,
    private listingService: ListingService,
  ) {}

  public async addStory(
    lang: string,
    storyData: CreateStoryDto,
  ): Promise<StoryDto> {
    const story = await Story.create(storyData);
    return this.mapStory(story, lang);
  }

  public async updateStory(
    id: string,
    lang: string,
    storyData: CreateStoryDto,
  ): Promise<StoryDto> {
    await Story.update(storyData, {
      where: {
        id: id,
      },
    });
    const story = await Story.findOne({
      where: {
        id: id,
      },
    });
    return this.mapStory(story, lang);
  }

  public async getAllStories(lang: string): Promise<StoryDto[]> {
    const stories = await Story.findAll({
      order: [['createdAt', 'DESC']],
    });
    const storyDtos: StoryDto[] = [];
    for (const story of stories) {
      storyDtos.push(await this.mapStory(story, lang));
    }
    return storyDtos;
  }

  public async getStory(
    id: string,
    lang: string,
    userId?: string,
  ): Promise<StoryDto | null> {
    const dbStory = await Story.findOne({
      where: {
        id: id,
      },
    });
    if (dbStory) {
      let userFollowings: string[] = [];
      if (dbStory && userId) {
        userFollowings = await this.userService.getUserFollowedUsers(userId, [
          dbStory.ownerId,
        ]);
      }
      const story = await this.mapStory(dbStory, lang, userFollowings);
      if (dbStory?.listingId) {
        const listing = await this.listingService.getListing(
          dbStory.listingId,
          lang,
        );
        if (listing) {
          story.listing = this.getListingSnippet(listing);
        }
      }
      return story;
    }
    return null;
  }

  public async deleteStory(
    ownerId: string,
    id: string,
  ): Promise<OperationResult> {
    const result = new OperationResult();
    try {
      const story = await Story.findOne({
        where: {
          id: id,
          ownerId: ownerId,
        },
      });
      if (!story) {
        result.success = false;
        result.code = ErrorCodes.NOT_FOUND;
      } else {
        const mediaFiles = story.media;
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
        await Story.destroy({
          where: {
            id: id,
            ownerId: ownerId,
          },
        });
        result.success = true;
      }
    } catch (error) {
      result.success = false;
      result.code = ErrorCodes.GENERAL_ERROR;
      result.message = error;
    }
    return result;
  }

  public async searchStories(
    searchModel: SearchStoryDto,
    lang: string,
    userId?: string,
  ): Promise<SearchResultDto<StoryDto>> {
    const where: any = {};
    if (searchModel.ownerId && searchModel.ownerId !== '') {
      where.ownerId = searchModel.ownerId;
    }
    if (searchModel.listingId && searchModel.listingId !== '') {
      where.listingId = searchModel.listingId;
    }
    if (searchModel.status != undefined) {
      where.status = searchModel.status;
    }

    const stories = await Story.findAndCountAll({
      where: where,
      offset: ((searchModel.pageIndex || 1) - 1) * (searchModel.pageSize || 10),
      limit: searchModel.pageSize,
      order: [['createdAt', 'DESC']],
    });

    const result = new SearchResultDto<StoryDto>();
    result.count = stories.count;
    if (result.count > 0) {
      const storiesWithListings = stories.rows.filter(
        (story) => story.listingId != undefined,
      );
      let listings: ListingDto[] = [];
      if (storiesWithListings && storiesWithListings.length > 0) {
        const listingIds = storiesWithListings.map(
          (story) => story.listingId || '',
        );
        listings = await this.listingService.getListingsByIds(lang, listingIds);
      }
      const ownerIds = stories.rows.map((s) => s.ownerId);

      let userFollowings: string[] = [];
      if (userId)
        userFollowings = await this.userService.getUserFollowedUsers(
          userId,
          ownerIds,
        );
      for (const dbStory of stories.rows) {
        const story = await this.mapStory(dbStory, lang, userFollowings);
        if (dbStory.listingId != undefined) {
          story.listing = this.getListingSnippet(
            listings.find((l) => l.id === dbStory.listingId),
          );
        }
        result.data.push(story);
      }
    }
    return result;
  }

  async mapStory(
    story: any,
    lang: string,
    userFollowings: string[] = [],
  ): Promise<StoryDto> {
    const disclaimers = await this.lookupsService.getDisclaimers(lang);
    const user = await this.userService.getUser(story.ownerId);
    return {
      id: story.id,
      type: 'Story',
      owner: user,
      listingId: story.listingId,
      disclaimerId: story.disclaimerId,
      disclaimerName:
        disclaimers.find((lt) => lt.id === story.disclaimerId)?.name || '',
      privacy: story.privacy,
      media: story.media,
      headerLine: story.headerLine,
      body: story.body,
      intro: story.intro,
      tagline: story.tagline,
      conclusion: story.conclusion,
      imaginativeYear: story.imaginativeYear,
      status: story.status,
      isUserFollowed: userFollowings.find((f) => f === story.ownerId)
        ? true
        : false,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    };
  }

  getListingSnippet(listing?: ListingDto): any {
    if (listing) {
      return {
        id: listing.id,
        brandName: listing.brandName,
        name: listing.name,
        ratings: 0,
        media: listing.media,
        followers: 0,
        stories: 1,
        priceType: listing.priceTypeName,
        hiringType: listing.otherHiring || listing.hiringTypeName,
        otherPriceType: listing.otherPriceType,
        priceTypeFormat: listing.priceTypeFormat,
        stockAvailability: listing.stockAvailability,
        price: listing.price,
        currencySymbol: listing.currencySymbol,
        currencyCode: listing.currencyStandardCode,
        offerPrice: listing.offerPrice,
        avgReviews: Number(listing.avgReviews ?? 0),
        reviewsCount: Number(listing.reviewsCount ?? 0),
      };
    }
    return null;
  }
}
