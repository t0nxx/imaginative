import { Test, TestingModule } from '@nestjs/testing';
import { LookupsService } from './lookups.service';

let lookupService: LookupsService;

describe('Lookups', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LookupsService],
    }).compile();

    lookupService = module.get<LookupsService>(LookupsService);
  });

  test('Product Listing Types Found', async () => {
    const listingTypes = await lookupService.getListingTypes('Product', 'en');
    expect(listingTypes.length).toBeGreaterThan(0);
  });
});
