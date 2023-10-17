import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapPageComponent } from './map-page.component';
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips'
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';
import { of } from 'rxjs';
import { LayerService } from '../../services/layer.service';
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

describe('MapPageComponent', () => {
  let component: MapPageComponent;
  let fixture: ComponentFixture<MapPageComponent>;
  let mockApiService: Partial<ApiService>;
  let mockMapService: Partial<MapService>;
  let mockLocation: Partial<Location>;
  let mockLayerService: Partial<LayerService>;

  beforeEach(async () => {
    mockApiService = {
      getTableData: jest.fn().mockReturnValue(of(mockTableData))
    };

    mockLayerService = {
      addLayer: jest.fn()
    };

    mockMapService = {
      setView: jest.fn(),
      setTarget: jest.fn(),
      addBaseLayer: jest.fn()
    };

    mockLocation = {
      back: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [MapPageComponent],
      imports: [
        MatCardModule,
        MatChipsModule,
        MatButtonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: MapService, useValue: mockMapService },
        { provide: LayerService, useValue: mockLayerService},
        { provide: Location, useValue: mockLocation }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call back function from location service on routeBack', () => {
    component.routeBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should set map target on init', () => {
    expect(mockMapService.setTarget).toHaveBeenCalledWith('map');
  });
});
