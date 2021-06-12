import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Headers,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListingService } from './listing.service';
import CreateListingDto from './dto/CreateListingDto';
import { User } from '@/user/user.decorator';
import ListingDto from './dto/ListingDto';
import { execOperation } from './../utils/Utils';
import SearchListingDto from './dto/SearchListingDto';
import CreateListingReviewDto from './dto/CreateListingReviewDto';
import ListingReviewDto from './dto/ListingReviewDto';
import ToggleListingFollowDto from './dto/ToggleListingFollowDto';
import OperationResult from '@/shared/models/OperationResult';

@ApiBearerAuth()
@ApiTags('Listings')
@Controller()
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post('v1/listings')
  async createListing(
    @Headers('lang') lang = 'en',
    @User('id') userid: number,
    @Body() listingData: CreateListingDto,
  ): Promise<ListingDto> {
    return await execOperation(async () => {
      listingData.ownerId = userid;
      const listing = await this.listingService.addListing(lang, listingData);
      return listing;
    });
  }

  @Put('v1/listings/:id')
  async updateListing(
    @Headers('lang') lang = 'en',
    @Param('id') id: number,
    @Body() listingData: CreateListingDto,
  ) {
    const listing = await this.listingService.updateListing(
      id,
      lang,
      listingData,
    );
    return listing;
  }

  @Get('v1/listings')
  async getAllListings(@Headers('lang') lang = 'en'): Promise<any> {
    const listings = await this.listingService.getAllListings(lang);
    return listings;
  }

  @Post('v1/listings/search')
  async searchListings(
    @User('id') userId: number,
    @Headers('lang') lang = 'en',
    @Body() searchModel: SearchListingDto,
  ): Promise<any> {
    const listings = await this.listingService.searchListings(
      searchModel,
      lang,
      userId,
    );
    return listings;
  }

  @Get('v1/listings/:id')
  async getListing(
    @User('id') userId: number,
    @Headers('lang') lang = 'en',
    @Param('id') id: number,
  ): Promise<any> {
    const listing = await this.listingService.getListing(id, lang, userId);
    return listing;
  }

  @Delete('v1/listings/:id')
  async deleteListing(
    @User('id') userId: number,
    @Param('id') id: number,
  ): Promise<any> {
    const result = await this.listingService.deleteListing(userId, id);
    return result;
  }

  @Post('v1/listings/:id/reviews')
  async upsertListingReview(
    @User('id') userId: number,
    @Param('id') id: number,
    @Body() listingReviewData: CreateListingReviewDto,
  ) {
    listingReviewData.userId = userId;
    listingReviewData.listingId = id;
    const listingReview = await this.listingService.upsertReview(
      listingReviewData,
    );
    // return listingReview;
  }

  @Get('v1/listings/:listingId/reviews')
  async getListingReviews(
    @Param('listingId') listingId: number,
    @Query('pageIndex') pageIndex: number,
    @Query('pageSize') pageSize: number,
  ): Promise<any> {
    const reviews = await this.listingService.getListingReviews(
      listingId,
      pageIndex ?? 1,
      pageSize ?? 10,
    );
    return reviews;
  }

  @Delete('v1/listings/:listingId/reviews/:reviewId')
  async deleteListingReview(
    @User('id') userId: number,
    @Param('listingId') listingId: number,
    @Param('reviewId') reviewId: number,
  ): Promise<any> {
    const result = await this.listingService.deleteReview(
      userId,
      reviewId,
      listingId,
    );
    return result;
  }

  @Post('v1/listings/toggle-listing-follow')
  async toggleListingFollow(
    @User('id') userId: number,
    @Body() toggleModel: ToggleListingFollowDto,
  ): Promise<OperationResult> {
    toggleModel.userId = userId;
    const result = await this.listingService.toggleListingFollow(toggleModel);
    return result;
  }
}
