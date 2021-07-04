import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Story from '../models/Story';
import CreateStoryDto from './dto/CreateStory.dto';
import StoryDto from './dto/StoryDto';
import { LookupsService } from '../lookups/lookups.service';
import { UserService } from '@/user/user.service';
import OperationResult from '../shared/models/OperationResult';
import { DeepLinkShareRoutes, ErrorCodes } from '@/shared/constants';
import SearchResultDto from '@/shared/models/SearchResultDto';
import SearchStoryDto from './dto/SearchStoryDto';
import { ListingService } from '@/listing/listing.service';
import ListingDto from '@/listing/dto/ListingDto';
import { PrismaService } from '@/shared/core/prisma.service';
import { Prisma } from '@prisma/client';
import FireBaseService from '@/shared/core/FireBase.service';
import { FileService } from '@/shared/core/file.service';

@Injectable()
export class StoryService {
  constructor(
    private lookupsService: LookupsService,
    private userService: UserService,
    private listingService: ListingService,
    private readonly db: PrismaService,
    private readonly firebaseService: FireBaseService,
    private readonly fileService: FileService,
  ) {}

  // public async updateStory(
  //   id: string,
  //   lang: string,
  //   _storyData: CreateStoryDto,
  // ): Promise<StoryDto> {
  //   // await Story.update(storyData, {
  //   //   where: {
  //   //     id: id,
  //   //   },
  //   // });
  //   const story = await Story.findOne({
  //     where: {
  //       id: id,
  //     },
  //   });
  //   return this.mapStory(story, lang);
  // }

  // public async searchStories(
  //   searchModel: SearchStoryDto,
  //   lang: string,
  //   userId?: number,
  // ) {
  //   const where: any = {};
  //   if (searchModel.ownerId && searchModel.ownerId !== '') {
  //     where.ownerId = searchModel.ownerId;
  //   }
  //   if (searchModel.listingId && searchModel.listingId !== '') {
  //     where.listingId = searchModel.listingId;
  //   }
  //   if (searchModel.status != undefined) {
  //     where.status = searchModel.status;
  //   }

  //   const stories = await this.db.story.findMany({
  //     where: where,
  //     orderBy: {
  //       createdAt: 'desc',
  //     },
  //   });

  //   // return { data: stories, count: stories.length };

  //   // const stories = await Story.findAndCountAll({
  //   //   where: where,
  //   //   offset: ((searchModel.pageIndex || 1) - 1) * (searchModel.pageSize || 10),
  //   //   limit: searchModel.pageSize,
  //   //   order: [['createdAt', 'DESC']],
  //   // });

  //   const result = new SearchResultDto<StoryDto>();
  //   result.count = stories.length;
  //   if (result.count > 0) {
  //     const storiesWithListings = stories.filter(
  //       (story) => story.listingId != undefined,
  //     );
  //     let listings: ListingDto[] = [];
  //     if (storiesWithListings && storiesWithListings.length > 0) {
  //       const listingIds = storiesWithListings.map((story) => story.listingId);
  //       listings = await this.listingService.getListingsByIds(lang, listingIds);
  //     }
  //     const ownerIds = stories.map((s) => s.ownerId);

  //     let userFollowings: number[] = [];
  //     if (userId)
  //       userFollowings = await this.userService.getUserFollowedUsers(
  //         userId,
  //         ownerIds,
  //       );
  //     for (const dbStory of stories) {
  //       const story = await this.mapStory(dbStory, lang, userFollowings);
  //       if (dbStory.listingId != undefined) {
  //         story.listing = this.getListingSnippet(
  //           listings.find((l) => l.id === dbStory.listingId),
  //         );
  //       }
  //       result.data.push(story);
  //     }
  //   }
  //   return result;
  // }

  async mapStory(story: any, lang: string, myId: number): Promise<StoryDto> {
    const { data: disclaimers } = await this.lookupsService.getDisclaimers(
      lang,
    );

    const { data: user } = await this.userService.getUser(story.ownerId, myId);
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
      viewCount: story.viewCount,
      likeCount: story.likeCount,
      commentCount: story.commentCount,
      shareCount: story.shareCount,
      isRepublished: story.isRepublished,

      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    };
  }

  // getListingSnippet(listing?: ListingDto): any {
  //   if (listing) {
  //     return {
  //       id: listing.id,
  //       brandName: listing.brandName,
  //       name: listing.name,
  //       ratings: 0,
  //       media: listing.media,
  //       followers: 0,
  //       stories: 1,
  //       priceType: listing.priceTypeName,
  //       hiringType: listing.otherHiring || listing.hiringTypeName,
  //       otherPriceType: listing.otherPriceType,
  //       priceTypeFormat: listing.priceTypeFormat,
  //       stockAvailability: listing.stockAvailability,
  //       price: listing.price,
  //       currencySymbol: listing.currencySymbol,
  //       currencyCode: listing.currencyStandardCode,
  //       offerPrice: listing.offerPrice,
  //       avgReviews: Number(listing.avgReviews ?? 0),
  //       reviewsCount: Number(listing.reviewsCount ?? 0),
  //     };
  //   }
  //   return null;
  // }
  ///////////////////////////////////// new - mahmoud done ///////////////////////////////
  public async addStory(lang: string, storyData: CreateStoryDto, myId: number) {
    //// check the sended listing id is valid
    if (storyData.listingId) {
      const listing = await this.db.listings.findUnique({
        where: {
          id: storyData.listingId,
        },
      });

      if (!listing) {
        throw new NotFoundException('listing not found');
      }
    }
    /// note here , to stor arr of object as a json in prisma , it must be transformed to prisma.jsonarray like above
    const jsonArr = storyData.media as Prisma.JsonArray;
    // story status
    //0-draft|1- published,2-user_template|3-example_template
    const story = await this.db.story.create({
      data: {
        ...storyData,
        media: jsonArr,
        ownerId: myId,
      },
    });
    const result = await this.mapStory(story, lang, myId);
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = result;
    return res;
  }

  public async getAllStories(
    lang: string,
    pageIndex: number,
    pageSize: number,
    myId: number,
  ) {
    const stories = await this.db.story.findMany({
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: 'desc',
      },
    });
    let result: StoryDto[] = [];
    // to to it in async way for performance
    const promisesArr = [];
    for (const story of stories) {
      promisesArr.push(this.mapStory(story, lang, myId));
    }
    result = await Promise.all(promisesArr);
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = result;
    return res;
  }

  public async getStory(id: number, lang: string, myId?: number) {
    const dbStory = await this.db.story.findUnique({
      where: {
        id: id,
      },
    });

    if (!dbStory) {
      throw new NotFoundException('story not found');
    }
    const result = await this.mapStory(dbStory, lang, myId);
    await this.db.story.update({
      where: {
        id: dbStory.id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
    // if (dbStory?.listingId) {
    //   const listing = await this.listingService.getListing(
    //     dbStory.listingId,
    //     lang,
    //   );
    //   if (listing) {
    //     story.listing = this.getListingSnippet(listing);
    //   }
    // }
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = result;
    return res;
  }

  public async deleteStory(id: number, myId: number) {
    const dbStory = await this.db.story.findUnique({
      where: {
        id: id,
      },
    });

    if (!dbStory) {
      throw new NotFoundException('story not found');
    }

    if (dbStory.ownerId != myId) {
      throw new ForbiddenException('you are not allowed to edit this resource');
    }
    // delete story media
    const mediaFiles = dbStory.media as Prisma.JsonArray;
    for await (const media of mediaFiles) {
      this.fileService.removeFile(media['key']);
    }
    await this.db.story.delete({
      where: {
        id: id,
      },
    });

    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    return res;
  }
  async shareStory(id: number) {
    const dbStory = await this.db.story.findUnique({
      where: {
        id: id,
      },
    });

    if (!dbStory) {
      throw new NotFoundException('story not found');
    }
    const result = await this.firebaseService.getFirebaseDynamicLink(
      DeepLinkShareRoutes.story,
      { resourceId: dbStory.id },
    );
    /// increase share count by one
    await this.db.story.update({
      where: {
        id: dbStory.id,
      },
      data: {
        shareCount: {
          increment: 1,
        },
      },
    });
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = result;
    return res;
  }

  async toggleLikeStory(storyId: number, myId: number) {
    const isAlreadyLiked = await this.db.storyLikes.findFirst({
      where: {
        storyId: storyId,
        userId: myId,
      },
    });

    if (isAlreadyLiked) {
      await this.db.storyLikes.delete({
        where: {
          id: isAlreadyLiked.id,
        },
      });
      /// decrease like count by one
      await this.db.story.update({
        where: {
          id: storyId,
        },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });
    } else {
      /// increase like count by one
      await this.db.storyLikes.create({
        data: {
          storyId: storyId,
          userId: myId,
        },
      });
      await this.db.story.update({
        where: {
          id: storyId,
        },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });

      /// @ queue , add to notifications queue
    }
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    return res;
  }

  ///// comments section
  async addCommentStory(storyId: number, myId: number, comment: string) {
    const dbStory = await this.db.story.findUnique({
      where: {
        id: storyId,
      },
    });

    if (!dbStory) {
      throw new NotFoundException('story not found');
    }
    await this.db.storyComments.create({
      data: {
        storyId: storyId,
        userId: myId,
        comment: comment,
      },
    });
    /// increase comments count by one
    await this.db.story.update({
      where: {
        id: storyId,
      },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    /// @ queue , add to notifications queue

    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    return res;
  }
  async updateCommentStory(commentId: number, myId: number, comment: string) {
    const existComment = await this.db.storyComments.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!existComment) {
      throw new NotFoundException('comment not found');
    }

    if (existComment.userId != myId) {
      throw new ForbiddenException('you are not allowed to edit this resource');
    }
    await this.db.storyComments.update({
      where: {
        id: commentId,
      },
      data: {
        comment: comment,
      },
    });
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    return res;
  }
  async deleteCommentStory(commentId: number, myId: number) {
    const existComment = await this.db.storyComments.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!existComment) {
      throw new NotFoundException('comment not found');
    }

    if (existComment.userId != myId) {
      throw new ForbiddenException('you are not allowed to edit this resource');
    }
    await this.db.storyComments.delete({
      where: {
        id: commentId,
      },
    });
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    return res;
  }
  async getCommentsOfStory(
    pageIndex: number,
    pageSize: number,
    myId: number,
    storyId: number,
  ) {
    const result = await this.db.storyComments.findMany({
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
      orderBy: {
        id: 'desc',
      },
      where: {
        storyId: storyId,
      },
    });

    const res = new OperationResult();
    /// map isOwner bool for each comment
    res.data = result.map((c) => {
      return {
        ...c,
        /// mean is comment owner , this should help front end to show edit/delete btn
        isProfileOwner: myId && myId == c.userId ? true : false,
      };
    });

    res.message[0] = 'successfully temp message';
    return res;
  }
}
