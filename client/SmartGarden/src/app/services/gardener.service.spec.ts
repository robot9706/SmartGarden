import { TestBed } from '@angular/core/testing';

import { GardenerService } from './gardener.service';

describe('GardenerService', () => {
  let service: GardenerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GardenerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
