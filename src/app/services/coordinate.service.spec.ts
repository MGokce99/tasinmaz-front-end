import { TestBed, inject } from '@angular/core/testing';

import { CoordinateService } from './coordinate.service';

describe('Service: CoordinateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoordinateService]
    });
  });
  it('should ...', inject([CoordinateService], (service: CoordinateService) => {
    expect(service).toBeTruthy();
  }));
});
