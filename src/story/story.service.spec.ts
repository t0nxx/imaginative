import { Test, TestingModule } from '@nestjs/testing';
//import Listing from '../models/Listing';
import { StoryService } from './story.service';
import { LookupsService } from '@/lookups/lookups.service';
import { v4 } from 'uuid';
// import {ListingStatus} from '@/shared/constants';
import { UserService } from '@/user/user.service';
import MailManager from '@/shared/core/MailManager';
import FireBase from '@/shared/core/FireBase.service';
import { ListingService } from '../listing/listing.service';
import CreateStoryDto from './dto/CreateStoryDto';

let storyService: StoryService;

describe('Stories', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoryService,
        LookupsService,
        UserService,
        MailManager,
        FireBase,
        ListingService,
      ],
    }).compile();

    storyService = module.get<StoryService>(StoryService);
  });

  test('Create Story reflects in db', async () => {
    const lang = 'en';
    const story: CreateStoryDto = {
      id: v4(),
      ownerId: '9d412112-0868-460f-bbcc-bb3153ab8fa9',
      listingId: '5e08a056-7ef7-4e9a-a913-b973f01a462d',
      privacy: 'Public',
      media: {},
      headerLine: 'test',
      disclaimerId: 'b9fa374e-677c-4e1d-aab9-883653a19151',
      intro: 'test',
      body: 'test',
      tagline: 'test',
      conclusion: 'test',
      imaginativeYear: 2029,
      status: 1,
    };
    const result = await storyService.addStory(lang, story);
    expect(result).toBeDefined();
  });

  // test("Delete Story removes from db", async () => {
  //   const ownerId = '3b0a7908-7d16-4ad8-a5c7-ec17e5ef01fa';
  //   const id = 'fe85ad83-a0ce-4190-a066-9419f2171be6';
  //   const result = await storyService.deleteStory(ownerId, id);
  //   expect(result.success).toEqual(true);
  // });

  // test("Get Draft Stories", async () => {
  //     const ownerId = '3b0a7908-7d16-4ad8-a5c7-ec17e5ef01fa';
  //     //const id = 'fe85ad83-a0ce-4190-a066-9419f2171be6';
  //     const result = await storyService.searchStories({
  //       status:0,
  //       ownerId: ownerId,

  //     },"en");
  //     console.log(result);
  //     expect(result).toBe({});
  // });
});
