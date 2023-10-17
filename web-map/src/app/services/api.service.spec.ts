import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { LandRegistryTitle } from '../models/LandRegistryTitle';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve table data and map to LandRegistryTitle', (done) => {
    const mockTitles = [
      {
        'Title Number': 'TN1',
        'Property Address': 'Address 1',
        'Tenure': 'Freehold',
        'X': -0.59,
        'Y': 82.4
      },
    ];

    service.getTableData().subscribe(titles => {
      expect(titles.length).toBe(mockTitles.length)
      expect(titles[0] instanceof LandRegistryTitle).toBeTruthy()
      expect(titles[0].title_no).toBe('TN1')
      expect(titles[0].prop_address).toBe('Address 1')
      expect(titles[0].tenure).toBe('Freehold')
      expect(titles[0].x).toBe(-0.59)
      expect(titles[0].y).toBe(82.4)
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/titledata/testdata.json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTitles);
  });
});
