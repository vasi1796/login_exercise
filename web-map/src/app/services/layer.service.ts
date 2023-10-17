import { Injectable } from '@angular/core';
import BaseLayer from 'ol/layer/Base';
import { MapService } from './map.service';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import TopoJSON from 'ol/format/TopoJSON.js';

@Injectable({
  providedIn: 'root'
})
export class LayerService {
  layers: BaseLayer[] = []

  constructor(private mapService: MapService) {
    const topojsonBaseLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new TopoJSON({
          layerName: 'layer',
          layers: ['buildings'],
        }),
        maxZoom: 15,
        url:
          'https://tile.nextzen.org/tilezen/vector/v1/all/{z}/{x}/{y}.topojson?api_key=' +
          'Xnf3x1ZaR7i1ZDTpu7pilw',
      })
    })
    topojsonBaseLayer.set('name', 'Building Topology')
    this.layers.push(topojsonBaseLayer)
    this.mapService.addBaseLayer(topojsonBaseLayer)
  }

  addLayer(lon:number, lat:number, name: string): void {
    let addedLayer = this.mapService.addLayer(lon, lat, name)
    this.layers.push(addedLayer)
  }

  removeLayer(layer: BaseLayer): void {
    this.layers = this.layers.filter(l => l !== layer)
    this.mapService.map.removeLayer(layer)
  }
}
