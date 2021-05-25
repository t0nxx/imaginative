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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { ListingService } from './listing.service';
import CreateListingDto from './dto/CreateListingDto';
import { User } from '@/user/user.decorator';
import ListingDto from './dto/ListingDto';
import { v4 } from 'uuid';
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

  @ApiOperation({ summary: 'Create new listing' })
  @ApiResponse({
    status: 201,
    description: 'The listing has been successfully created.',
  })
  @ApiBody({ type: 'CreateListingDto' })
  @Post('v1/listings')
  async createListing(
    @Headers('lang') lang = 'en',
    @User('id') userid: string,
    @Body() listingData: CreateListingDto,
  ): Promise<ListingDto> {
    return await execOperation(async () => {
      listingData.ownerId = userid;
      listingData.id = v4();
      listingData.viewsCount = 0;
      listingData.url = listingData.url ?? '';
      listingData.isEdited = false;
      const listing = await this.listingService.addListing(lang, listingData);
      return listing;
    });
  }

  @ApiOperation({ summary: 'Updates an existing listing' })
  @ApiResponse({
    status: 201,
    description: 'The listing has been successfully updated.',
  })
  @ApiBody({ type: 'CreateListingDto' })
  @Put('v1/listings/:id')
  async updateListing(
    @Headers('lang') lang = 'en',
    @Param('id') id: string,
    @Body() listingData: CreateListingDto,
  ): Promise<ListingDto> {
    listingData.isEdited = true;
    const listing = await this.listingService.updateListing(
      id,
      lang,
      listingData,
    );
    return listing;
  }

  @ApiOperation({ summary: 'Gets all listings' })
  @ApiResponse({ status: 200, description: 'Return all listings' })
  @Get('v1/listings')
  async getAllListings(@Headers('lang') lang = 'en'): Promise<any> {
    const listings = await this.listingService.getAllListings(lang);
    return listings;
  }

  @ApiOperation({ summary: 'Searches listings using provided field criteria' })
  @ApiResponse({
    status: 200,
    description: 'Return all matched listings listings',
  })
  @ApiBody({ type: 'SearchListingDto' })
  @Post('v1/listings/search')
  async searchListings(
    @User('id') userId: string,
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

  @ApiOperation({ summary: 'Gets a listing given its id' })
  @ApiResponse({ status: 200, description: 'Returns the listing' })
  @Get('v1/listings/:id')
  async getListing(
    @User('id') userId: string,
    @Headers('lang') lang = 'en',
    @Param('id') id: string,
  ): Promise<any> {
    const listing = await this.listingService.getListing(id, lang, userId);
    return listing;
  }

  @ApiOperation({ summary: 'Deletes a listing given its id' })
  @ApiResponse({ status: 200, description: 'Returns Operation Result' })
  @Delete('v1/listings/:id')
  async deleteListing(
    @User('id') userId: string,
    @Param('id') id: string,
  ): Promise<any> {
    const result = await this.listingService.deleteListing(userId, id);
    return result;
  }

  @ApiOperation({ summary: 'Adds/Updates a review' })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully added/updated.',
  })
  @ApiBody({ type: 'CreateListingReviewDto' })
  @Post('v1/listings/:id/reviews')
  async upsertListingReview(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() listingReviewData: CreateListingReviewDto,
  ): Promise<ListingReviewDto> {
    listingReviewData.userId = userId;
    listingReviewData.listingId = id;
    const listingReview = await this.listingService.upsertReview(
      listingReviewData,
    );
    return listingReview;
  }

  @ApiOperation({ summary: 'Gets page of reviews for a given listing Id' })
  @ApiResponse({
    status: 200,
    description: 'Return page of reviews for a given listing',
  })
  @Get('v1/listings/:listingId/reviews')
  async getListingReviews(
    @Param('listingId') listingId: string,
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

  @ApiOperation({ summary: 'Deletes a review given its id' })
  @ApiResponse({ status: 200, description: 'Returns Operation Result' })
  @Delete('v1/listings/:listingId/reviews/:reviewId')
  async deleteListingReview(
    @User('id') userId: string,
    @Param('listingId') listingId: string,
    @Param('reviewId') reviewId: string,
  ): Promise<any> {
    const result = await this.listingService.deleteReview(
      userId,
      reviewId,
      listingId,
    );
    return result;
  }

  @ApiOperation({ summary: 'Toggles the follow record of a given listing' })
  @ApiResponse({ status: 201, description: 'Operation result object' })
  @ApiBody({ type: 'ToggleListingFollowDto' })
  @Post('v1/listings/toggle-listing-follow')
  async toggleListingFollow(
    @User('id') userId: string,
    @Body() toggleModel: ToggleListingFollowDto,
  ): Promise<OperationResult> {
    toggleModel.userId = userId;
    const result = await this.listingService.toggleListingFollow(toggleModel);
    return result;
  }
}
