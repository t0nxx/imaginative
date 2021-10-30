import { ListingService } from '@/listing/listing.service';
import { PrismaService } from '@/shared/core/prisma.service';
import OperationResult from '@/shared/models/OperationResult';
import { StoryService } from '@/story/story.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeService {
  constructor(
    private storyService: StoryService,
    private listingService: ListingService,
    private readonly db: PrismaService,
  ) {}
  async getHomeStoriesAndListings(lang, pageIndex, pageSize, myId) {
    //// home page should display
    // 1- my followed listings
    // 2- my followed listings stories
    // 3 - my own stories
    // 4- my own listings

    //////////////////////////////////////////////////////////////////////////
    //// 1- my followed listings
    //// 3- my own listings
    const [myFollowedListing, myOwnListing] = await Promise.all([
      this.db.listingFollowers.findMany({
        where: {
          userId: myId,
        },
      }),
      this.db.listings.findMany({
        where: {
          ownerId: myId,
        },
      }),
    ]);
    const myFollowedListingIds = myFollowedListing.map((e) => e.listingId);
    const myOwnListingIds = myOwnListing.map((e) => e.id);

    const myFollowedListingStoriesAndOwnStories = await this.db.story.findMany({
      where: {
        OR: [
          // 2- my followed listings stories
          {
            listingId: {
              in: myFollowedListingIds,
            },
          },
          // 3 - my own stories
          {
            ownerId: myId,
          },
        ],
      },
      select: {
        id: true,
        ownerId: true,
      },
    });

    const myFollowedListingStoriesAndOwnStoriesIds =
      myFollowedListingStoriesAndOwnStories.map((e) => e.id);

    const [homeListings, { data: homeStories }] = await Promise.all([
      this.listingService.getListingsByIds(
        lang,
        [...myOwnListingIds, ...myFollowedListingIds],
        myId,
        pageIndex,
        pageSize,
      ),
      this.storyService.getStoriesByIds(
        lang,
        myFollowedListingStoriesAndOwnStoriesIds,
        myId,
        pageIndex,
        pageSize,
      ),
    ]);

    const res = new OperationResult();
    res.message[0] = 'done';
    res.data = [...homeListings, ...homeStories];
    return res;
  }
}
