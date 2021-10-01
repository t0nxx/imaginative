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
import CreateListingDto from './dto/CreateListing.dto';
import { User } from '@/user/user.decorator';
import ListingDto from './dto/Listing.dto';
import { execOperation } from './../utils/Utils';
import SearchListingDto from './dto/SearchListingDto';
import CreateListingReviewDto from './dto/CreateListingReviewDto';
import ListingReviewDto from './dto/ListingReviewDto';
import ToggleListingFollowDto from './dto/ToggleListingFollowDto';
import OperationResult from '@/shared/models/OperationResult';
import { I18nLang } from 'nestjs-i18n';
import UpdateListingDto from './dto/UpdateListing.dto';

@ApiBearerAuth()
@ApiTags('Listings')
@Controller()
export class ListingController {
  constructor(private readonly listingService: ListingService) {}

  @Post('v1/listings')
  async createListing(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Body() listingData: CreateListingDto,
  ) {
    return this.listingService.addListing(lang, listingData, myId);
  }

  @Put('v1/listings/:id')
  async updateListing(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Param('id') id: number,
    @Body() listingData: UpdateListingDto,
  ) {
    return this.listingService.updateListing(lang, id, listingData, myId);
  }

  @Get('v1/listings')
  async getAllListings(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.listingService.getAllListings(
      lang,
      pageIndex ?? 1,
      pageSize ?? 10,
      myId ?? 0,
    );
  }
  @Get('v1/listings/:id')
  async getOneListingById(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Param('id') id: number,
  ) {
    return this.listingService.getOneListingById(id, lang, myId ?? 0);
  }

  @Delete('v1/listings/:id')
  async deleteListing(@User('id') myId: number, @Param('id') id: number) {
    return this.listingService.deleteListing(myId ?? 0, id);
  }

  /// story actions like , comment .... etc
  @Post('v1/listings/:id/share')
  async shareListing(@Param('id') id: number) {
    return this.listingService.shareListing(id);
  }
  @Post('v1/listings/:id/toggle-follow')
  async toggleLikeStory(
    @User('id') myId: number,
    @Param('id') listingId: number,
  ) {
    return this.listingService.toggleFollowListing(listingId, myId);
  }

  @Get('v1/listings/:id/stories')
  async getAllLStoriesOfListing(
    @I18nLang() lang: string,
    @User('id') myId: number,
    @Param('id') listingId: number,
    @Query('pageIndex') pageIndex?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.listingService.getAllLStoriesOfListing(
      lang,
      pageIndex ?? 1,
      pageSize ?? 10,
      myId ?? 0,
      listingId,
    );
  }
  // @Post('v1/listings/search')
  // async searchListings(
  //   @User('id') userId: number,
  //   @Headers('lang') lang = 'en',
  //   @Body() searchModel: SearchListingDto,
  // ): Promise<any> {
  //   const listings = await this.listingService.searchListings(
  //     searchModel,
  //     lang,
  //     userId,
  //   );
  //   return listings;
  // }

  // @Post('v1/listings/:id/reviews')
  // async upsertListingReview(
  //   @User('id') userId: number,
  //   @Param('id') id: number,
  //   @Body() listingReviewData: CreateListingReviewDto,
  // ) {
  //   listingReviewData.userId = userId;
  //   listingReviewData.listingId = id;
  //   const listingReview = await this.listingService.upsertReview(
  //     listingReviewData,
  //   );
  //   // return listingReview;
  // }

  // @Get('v1/listings/:listingId/reviews')
  // async getListingReviews(
  //   @Param('listingId') listingId: number,
  //   @Query('pageIndex') pageIndex: number,
  //   @Query('pageSize') pageSize: number,
  // ): Promise<any> {
  //   const reviews = await this.listingService.getListingReviews(
  //     listingId,
  //     pageIndex ?? 1,
  //     pageSize ?? 10,
  //   );
  //   return reviews;
  // }

  // @Delete('v1/listings/:listingId/reviews/:reviewId')
  // async deleteListingReview(
  //   @User('id') userId: number,
  //   @Param('listingId') listingId: number,
  //   @Param('reviewId') reviewId: number,
  // ): Promise<any> {
  //   const result = await this.listingService.deleteReview(
  //     userId,
  //     reviewId,
  //     listingId,
  //   );
  //   return result;
  // }

  // @Post('v1/listings/toggle-listing-follow')
  // async toggleListingFollow(
  //   @User('id') userId: number,
  //   @Body() toggleModel: ToggleListingFollowDto,
  // ): Promise<OperationResult> {
  //   toggleModel.userId = userId;
  //   const result = await this.listingService.toggleListingFollow(toggleModel);
  //   return result;
  // }
}
