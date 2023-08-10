import { PartialType } from '@nestjs/swagger';
import CreateStoryDto from './CreateStory.dto';

export class UpdateStoryDto extends PartialType(CreateStoryDto) {}
