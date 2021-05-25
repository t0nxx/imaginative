import { Test, TestingModule } from '@nestjs/testing';
//import Listing from '../models/Listing';
import { ListingService } from './listing.service';
import { LookupsService } from '@/lookups/lookups.service';
// import { v4 } from 'uuid';
// import {ListingStatus} from '@/shared/constants';
import { UserService } from '@/user/user.service';
import MailManager from '@/shared/core/MailManager';
import FireBase from '@/shared/core/FireBase';

let listingService: ListingService;

describe('Listings', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingService,
        LookupsService,
        UserService,
        MailManager,
        FireBase,
      ],
    }).compile();

    listingService = module.get<ListingService>(ListingService);
  });

  // test("Can Create a new Product Listing", async () => {
  //   const lang = "en";
  //   const date = new Date();
  //   let listing = {
  //       id: v4(),
  //       ownerId: v4(),
  //       pageType: "Content",
  //       listingTypeId: v4(),
  //       privacy: "Public",
  //       media: [
  //           {
  //               url:"http://google.com",
  //               type:"image"
  //           }
  //       ],
  //       name: "Scibey",
  //       brandName: "Scibey",
  //       description: "This is a research website",
  //       credentials:"",
  //       uses:"research articles indexing",
  //       stockAvailability: "30 units only",
  //       advantages: "promote your articles",
  //       url: "https://scibey.com",
  //       price:0,
  //       priceTypeId: '1ec33202-08fa-4d0b-ac22-5ee8f572e0ff',
  //       currencyId: '7cafec75-55e5-40a1-b977-21d9bd27bdda',
  //       hiringTypeId:'6714c1ae-18b5-4d36-8835-f4ec46363e0e',
  //       offerPrice: 0,
  //       offerDescription: "",
  //       socialLinks: ["https://facebook.com/scibeyconnect"],
  //       viewsCount:0,
  //       createdAt:date,
  //       updatedAt:date,
  //       status:1,
  //       isEdited:false,
  //       otherPriceType:"",
  //       overallRating:0,
  //       totalRatingCount:0
  //   };
  //   const newListing = await listingService.addListing(lang,listing);
  //   console.log(newListing);
  //   expect(newListing).toBeDefined();
  // });

  // test("Add review updates db", async () => {
  //   const review = {
  //     id:v4(),
  //     userId:'6d38d7c3-f329-4e60-b08a-9c25f85265b1',
  //     listingId:'5e08a056-7ef7-4e9a-a913-b973f01a462d',
  //     title: 'test',
  //     goodAboutListing: 'test',
  //     notGoodAboutListing: 'test',
  //     reviewText:'test',
  //     starRating: 5,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   };
  //   const result = await listingService.upsertReview(review);
  //   expect(result).toBeDefined();
  // });

  test('Delete Listing Review removes from db', async () => {
    const listingId = '5e08a056-7ef7-4e9a-a913-b973f01a462d';
    const reviewId = 'c12885fd-53a7-4a14-9216-190f603a1d2a';
    const userId = '93a02598-02d2-4ce3-8adb-175bd33ba252';
    const result = await listingService.deleteReview(
      userId,
      reviewId,
      listingId,
    );
    expect(result.success).toEqual(true);
  });

  // test("Delete Listing removes from db", async () => {
  //   const ownerId = '19c4c19a-2b1f-40e9-a967-cfc6abed3467';
  //   const id = '38c19035-2232-4eb9-ad3f-59a7c03a7ffc';
  //   const result = await listingService.deleteListing(ownerId, id);
  //   expect(result.success).toEqual(true);
  // });

  // test("GetAllListings found some", async () => {
  //   const lang = "en";
  //   const listings = await listingService.getAllListings(lang);
  //   expect(listings.length).toBeGreaterThan(0);
  // });

  // test("GetListingById found is Returning", async () => {
  //   const lang = "en";
  //   const listing = await listingService.getListing('685e8bcf-7dbf-4cf8-9589-af486e8a457b', lang);
  //   expect(listing).toBeDefined();
  // });

  // test("Update listing is reflecting in the db", async () => {
  //   const lang = "en";
  //   const id = '685e8bcf-7dbf-4cf8-9589-af486e8a457b';
  //   let listing = await listingService.getListing(id, lang);
  //   const updatedValue = "Save your money";
  //   if(listing){
  //     listing.offerDescription = "Save your money";
  //     const result = await listingService.updateListing(id,lang, listing);
  //     console.log(result);
  //   }
  //   listing = await listingService.getListing(id,lang);
  //   expect(listing?.offerDescription).toStrictEqual(updatedValue);
  // });
});
