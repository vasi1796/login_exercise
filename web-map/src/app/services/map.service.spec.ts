import { TestBed } from '@angular/core/testing';
import { MapService } from './map.service';
import * as olLayer from 'ol/layer';
import * as olSource from 'ol/source';
import { Map, View } from 'ol';
import BaseLayer from 'ol/layer/Base';

jest.mock('ol/Map');
jest.mock('ol/View');
jest.mock('ol/layer/Tile');
jest.mock('ol/source/OSM');
jest.mock('ol/layer/Vector');
jest.mock('ol/source/Vector');
jest.mock('ol/Feature');
jest.mock('ol/geom/Point');
jest.mock('ol/style/Style');
jest.mock('ol/style/Icon');

describe('MapService', () => {
  let service: MapService;
  let mockMapInstance: jest.Mocked<Map>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapService],
    });

    service = TestBed.inject(MapService);
    mockMapInstance = (Map as unknown as jest.Mock).mock.instances[0] as jest.Mocked<Map>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default map settings', () => {
    expect(service.map).toBeDefined();
    expect(olLayer.Tile).toHaveBeenCalled();
    expect(olSource.OSM).toHaveBeenCalled();
    expect(View).toHaveBeenCalled();
  });

  it('should set map target', () => {
    service.setTarget('test-target');
    expect(mockMapInstance.setTarget).toHaveBeenCalledWith('force a refresh');
    expect(mockMapInstance.setTarget).toHaveBeenCalledWith('test-target');
  });

  it('should add a base layer', () => {
    const mockBaseLayer = {} as BaseLayer;
    service.addBaseLayer(mockBaseLayer);
    expect(mockMapInstance.addLayer).toHaveBeenCalledWith(mockBaseLayer);
  });
});
