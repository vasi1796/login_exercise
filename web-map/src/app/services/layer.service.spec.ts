import { TestBed } from '@angular/core/testing';
import { LayerService } from './layer.service';
import { MapService } from './map.service';
import BaseLayer from 'ol/layer/Base';

const mapServiceMock = {
  addBaseLayer: jest.fn(),
  addLayer: jest.fn(),
  map: {
    removeLayer: jest.fn()
  }
};

describe('LayerService', () => {
  let service: LayerService;
  let mockMapService: jest.Mocked<MapService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LayerService,
        { provide: MapService, useValue: mapServiceMock }
      ]
    });

    service = TestBed.inject(LayerService);
    mockMapService = TestBed.inject(MapService) as jest.Mocked<MapService>;
  });

  afterEach(() => {
    // Reset any mock calls and instances.
    jest.clearAllMocks();
  });

  it('should initialize with Building Topology layer', () => {
    expect(service.layers.length).toBe(1);
    expect(service.layers[0].get('name')).toBe('Building Topology');
    expect(mockMapService.addBaseLayer).toHaveBeenCalled();
  });

  it('should add a new layer with provided coordinates and name', () => {
    const mockLayer = new BaseLayer({});
    mockMapService.addLayer.mockReturnValueOnce(mockLayer);

    service.addLayer(10, 20, 'Test Layer');

    expect(mockMapService.addLayer).toHaveBeenCalledWith(10, 20, 'Test Layer');
    expect(service.layers.length).toBe(2);
    expect(service.layers[1]).toBe(mockLayer);
  });

  it('should remove the specified layer', () => {
    const mockLayerToRemove = service.layers[0];

    service.removeLayer(mockLayerToRemove);

    expect(service.layers.length).toBe(0);
    expect(mockMapService.map.removeLayer).toHaveBeenCalledWith(mockLayerToRemove);
  });
});
