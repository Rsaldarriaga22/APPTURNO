import { TestBed } from '@angular/core/testing';

import { SpinnerNewService } from './spinner-new/spinner-new.service';

describe('SpinnerNewService', () => {
  let service: SpinnerNewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpinnerNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
