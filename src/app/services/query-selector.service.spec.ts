import { TestBed, inject } from '@angular/core/testing';

import { QuerySelectorService } from './query-selector.service';

describe('QuerySelectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuerySelectorService]
    });
  });

  it('should be created', inject([QuerySelectorService], (service: QuerySelectorService) => {
    expect(service).toBeTruthy();
  }));
});
