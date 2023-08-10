import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import CreateStoryDto from './dto/CreateStory.dto';
import StoryDto from './dto/StoryDto';
import { LookupsService } from '../lookups/lookups.service';
import { UserService } from '@/user/user.service';
import OperationResult from '../shared/models/OperationResult';
import {
  DeepLinkShareRoutes,
  ErrorCodes,
  MessageCodes,
} from '@/shared/constants';
import { PrismaService } from '@/shared/core/prisma.service';
import FireBaseService from '@/shared/core/FireBase.service';
import { FileService } from '@/shared/core/file.service';
import { LocalizationService } from '@/shared/core/localization.service';
import { UpdateStoryDto } from './dto/UpdateStory.dto';
import { CreateStoryDraftDto } from './dto/CreateStoryDraft.dto';

@Injectable()
export class StoryService {
  constructor(
    // @Inject(forwardRef(() => ListingService))
    // private listingService: ListingService,

    private lookupsService: LookupsService,
    private userService: UserService,
    private readonly db: PrismaService,
    private readonly firebaseService: FireBaseService,
    private readonly fileService: FileService,
    private readonly i18n: LocalizationService,
  ) {}

  ///////////////////////////////////// new - mahmoud done ///////////////////////////////

  async mapStory(story: any, lang: string, myId: number): Promise<StoryDto> {
    /// listing should added also when it done
    /// excute all in parallel for better performance
    // most of this arrays are cached in redis , don't worry about it
    const [
      { data: disclaimers },
      { data: privacy },
      { data: imaginativeYears },
      { data: user },
      listing,
    ] = await Promise.all([
      this.lookupsService.getDisclaimers(lang),
      this.lookupsService.getPrivacy(lang),
      this.lookupsService.getImaginativeYears(),
      this.userService.getUser(story.ownerId, myId),
      this.db.listings.findUnique({
        where: { id: story.listingId || 0 },
        select: { id: true, name: true },
      }),
    ]);

    return {
      id: story.id,
      type: 'Story',
      owner: user,
      listing: listing || null,
      disclaimer:
        disclaimers.find((lt) => lt.id === story.disclaimerId) || null,

      privacy: privacy.find((lt) => lt.id === story.privacyId) || null,

      imaginativeYear:
        imaginativeYears.find((lt) => lt.id === story.imaginativeYearId) ||
        null,

      headerLine: story.headerLine,
      headerImage: story.headerImage,
      body: story.body,
      intro: story.intro,
      tagline: story.tagline,
      info: story.info,
      conclusion: story.conclusion,
      introImages: story.introImages,
      bodyImages: story.bodyImages,
      conclusionImages: story.conclusionImages,

      otherImaginativeYear: story.otherImaginativeYear,
      status: story.status,
      viewCount: story.viewCount,
      likeCount: story.likeCount,
      commentCount: story.commentCount,
      shareCount: story.shareCount,
      productViewCount: story.productViewCount,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    };
  }

  public async getAllStories(
    lang: string,
    pageIndex: number,
    pageSize: number,
    myId: number,
  ) {
    const stories = await this.db.story.findMany({
      where: {
        status: 0,
      },
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
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }

  public async getStoriesByIds(
    lang: string,
    ids: number[],
    myId: number,
    pageIndex: number,
    pageSize: number,
  ) {
    const stories = await this.db.story.findMany({
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
    let result: StoryDto[] = [];
    // to to it in async way for performance
    const promisesArr = [];
    for (const story of stories) {
      promisesArr.push(this.mapStory(story, lang, myId));
    }
    result = await Promise.all(promisesArr);
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }

  public async addStory(lang: string, storyData: CreateStoryDto, myId: number) {
    //// check the sended listing id is valid
    if (storyData.listingId) {
      const listing = await this.db.listings.findUnique({
        where: {
          id: storyData.listingId,
        },
      });

      if (!listing) {
        throw new NotFoundException(ErrorCodes.LISTING_NOT_FOUND);
      }
      // update number of stories  count in product
      await this.db.listings.update({
        where: {
          id: listing.id,
        },
        data: {
          storiesCount: {
            increment: 1,
          },
        },
      });
    }
    const story = await this.db.story.create({
      data: {
        ...storyData,
        ownerId: myId,
      },
    });
    const result = await this.mapStory(story, lang, myId);
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(
      MessageCodes.STORY_PUBLISHED_SUCCESSFULLY,
    );
    res.data = result;
    return res;
  }

  public async updateStory(
    lang: string,
    storyData: UpdateStoryDto,
    storyId: number,
    myId: number,
  ) {
    const dbStory = await this.db.story.findUnique({
      where: {
        id: storyId,
      },
    });

    if (!dbStory) {
      throw new NotFoundException(ErrorCodes.STORY_NOT_FOUND);
    }

    if (dbStory.ownerId != myId) {
      throw new ForbiddenException(
        ErrorCodes.YOU_ARE_NOT_ALLOWED_TO_EDIT_THIS_RESOURCE,
      );
    }
    //// check the sended listing id is valid
    if (storyData.listingId) {
      const listing = await this.db.listings.findUnique({
        where: {
          id: storyData.listingId,
        },
      });

      if (!listing) {
        throw new NotFoundException(ErrorCodes.LISTING_NOT_FOUND);
      }
    }
    const story = await this.db.story.update({
      where: {
        id: storyId,
      },
      data: {
        ...storyData,
      },
    });
    const result = await this.mapStory(story, lang, myId);
    const res = new OperationResult();
    res.message[0] = 'Changes are Saved Successfully';
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
      throw new NotFoundException(ErrorCodes.STORY_NOT_FOUND);
    }
    const result = await this.mapStory(dbStory, lang, myId);

    //// if i open my stories , then skip view count
    if (dbStory.ownerId != myId) {
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
    }

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
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
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
      throw new NotFoundException(ErrorCodes.STORY_NOT_FOUND);
    }

    if (dbStory.ownerId != myId) {
      throw new ForbiddenException(
        ErrorCodes.YOU_ARE_NOT_ALLOWED_TO_EDIT_THIS_RESOURCE,
      );
    }
    // delete story media
    /// after client modification , media could be related to another example story or template
    // so if media deleted it would affect on all of them , so till now i'll not deleted any media
    // even if te story is deleted

    // await this.fileService.removeFile(dbStory.headerImage);
    // await this.fileService.removeFile(dbStory.introImage);
    // await this.fileService.removeFile(dbStory.bodyImage);
    // await this.fileService.removeFile(dbStory.conclusionImage);

    await this.db.story.delete({
      where: {
        id: id,
      },
    });

    const res = new OperationResult();
    res.message[0] = 'Deleted';
    return res;
  }
  async shareStory(id: number) {
    const dbStory = await this.db.story.findUnique({
      where: {
        id: id,
      },
    });

    if (!dbStory) {
      throw new NotFoundException(ErrorCodes.STORY_NOT_FOUND);
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
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
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
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
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
      throw new NotFoundException(ErrorCodes.STORY_NOT_FOUND);
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
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    return res;
  }
  async updateCommentStory(commentId: number, myId: number, comment: string) {
    const existComment = await this.db.storyComments.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!existComment) {
      throw new NotFoundException(ErrorCodes.COMMENT_NOT_FOUND);
    }

    if (existComment.userId != myId) {
      throw new ForbiddenException(
        ErrorCodes.YOU_ARE_NOT_ALLOWED_TO_EDIT_THIS_RESOURCE,
      );
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
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    return res;
  }
  async deleteCommentStory(commentId: number, myId: number) {
    const existComment = await this.db.storyComments.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!existComment) {
      throw new NotFoundException(ErrorCodes.COMMENT_NOT_FOUND);
    }

    if (existComment.userId != myId) {
      throw new ForbiddenException(
        ErrorCodes.YOU_ARE_NOT_ALLOWED_TO_EDIT_THIS_RESOURCE,
      );
    }
    await this.db.storyComments.delete({
      where: {
        id: commentId,
      },
    });
    const res = new OperationResult();
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
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

    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    return res;
  }

  ///// story draft section , getOne,delete,update will use same story functions
  public async getMyStoriesDrafts(
    lang: string,
    pageIndex: number,
    pageSize: number,
    myId: number,
  ) {
    const stories = await this.db.story.findMany({
      where: {
        ownerId: myId,
        status: 1,
      },
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
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }

  public async addStoryDraft(
    lang: string,
    storyData: CreateStoryDraftDto,
    myId: number,
  ) {
    //// check the sended listing id is valid
    if (storyData.listingId) {
      const listing = await this.db.listings.findUnique({
        where: {
          id: storyData.listingId,
        },
      });

      if (!listing) {
        throw new NotFoundException(ErrorCodes.LISTING_NOT_FOUND);
      }
    }
    const story = await this.db.story.create({
      data: {
        ...storyData,
        ownerId: myId,
        status: 1,
      },
    });

    const result = await this.mapStory(story, lang, myId);
    const res = new OperationResult();
    res.message[0] = 'Saved at Drafts Successfully';
    res.data = result;
    return res;
  }

  ///// story template section , getOne,delete,update will use same story functions
  public async getMyStoriesTemplates(
    lang: string,
    pageIndex: number,
    pageSize: number,
    myId: number,
  ) {
    const stories = await this.db.story.findMany({
      where: {
        ownerId: myId,
        status: 2,
      },
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
    res.message[0] = await this.i18n.translateMsg(MessageCodes.DONE);
    res.data = result;
    return res;
  }

  public async addStoryTemplate(lang: string, storyId: number, myId: number) {
    const storyToCopy = await this.db.story.findUnique({
      where: {
        id: storyId,
      },
    });

    if (!storyToCopy) {
      throw new NotFoundException(ErrorCodes.STORY_NOT_FOUND);
    }
    /// to create new id at run time
    delete storyToCopy.id;
    const story = await this.db.story.create({
      data: {
        ...storyToCopy,
        status: 2,
      },
    });

    const result = await this.mapStory(story, lang, myId);
    const res = new OperationResult();
    res.message[0] = 'Saved at My Template Successfully ';
    res.data = result;
    return res;
  }
}
