import { PartialType } from '@nestjs/swagger';
import CreateStoryDto from './CreateStory.dto';

export class CreateStoryDraftDto extends PartialType(CreateStoryDto) {}
