import { PartialType } from '@nestjs/swagger';
import CreateListingDto from './CreateListing.dto';

export default class UpdateListingDto extends PartialType(CreateListingDto) {}
