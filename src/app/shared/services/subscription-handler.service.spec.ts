import { TestBed } from '@angular/core/testing';

import { SubscriptionHandlerService } from './subscription-handler.service';

describe('SubscriptionHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriptionHandlerService = TestBed.get(SubscriptionHandlerService);
    expect(service).toBeTruthy();
  });
});
