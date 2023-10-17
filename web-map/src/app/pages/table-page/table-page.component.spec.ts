import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TablePageComponent } from './table-page.component';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator'
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { LandRegistryTitle } from 'src/app/models/LandRegistryTitle';

const mockTableData: LandRegistryTitle[] = [
  {
    title_no: "123",
    prop_address: "31-35 Kirby Street, London, EC1N 8TE",
    tenure: "Freehold",
    x: -0.107690402,
    y: 51.52028757
  },
  {
    title_no: "243751",
    prop_address: "31-35 Kirby Street, London, EC1N 8TE",
    tenure: "Freehold",
    x: -0.107690402,
    y: 51.52028757
  }
];

describe('TablePageComponent', () => {
  let component: TablePageComponent;
  let fixture: ComponentFixture<TablePageComponent>;
  let mockApiService: Partial<ApiService>;
  let mockRouter: Partial<Router>;

  beforeEach(async () => {
    mockApiService = {
      getTableData: jest.fn().mockReturnValue(of(mockTableData))
    };

    mockRouter = {
      navigate: jest.fn(),
      navigateByUrl: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [TablePageComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute, useValue: {
            queryParams: of({ page: 1 })
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set pageIndex from queryParams', () => {
    expect(component.pageIndex).toEqual(1);
  });

  it('should set table data from apiService', () => {
    expect(component.dataSource.data).toEqual(mockTableData);
  });

  it('should navigate to map page on openMapPage', () => {
    const row = mockTableData[0];
    component.openMapPage(row);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/map?id=123');
  });

  it('should update query params on changePage', () => {
    const mockEvent: PageEvent = {
      pageIndex: 2,
      pageSize: 5,
      length: 50
    };

    component.changePage(mockEvent);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['.'], { relativeTo: component.activatedRoute, queryParams: { page: 2 }});
  });
});
