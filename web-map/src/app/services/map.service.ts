import { Injectable } from '@angular/core';
import { Map, View } from 'ol';
import * as olLayer from 'ol/layer'
import { useGeographic } from 'ol/proj';
import * as olSource from 'ol/source'
import Feature from 'ol/Feature'
import * as olGeom from 'ol/geom'
import * as olStyle from 'ol/style'
import BaseLayer from 'ol/layer/Base';
import TileLayer from 'ol/layer/Tile';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private _map: Map

  get map (): Map {
    return this._map
  }

  get view (): View {
    return this._map.getView()
  }

  constructor() {
    useGeographic()
    this._map = new Map({
      layers: [
        new olLayer.Tile({
          source: new olSource.OSM({
            crossOrigin: 'anonymous'
          })
        }),
        new TileLayer({
          source: new olSource.TileWMS({
            url: 'http://localhost:8080/geoserver/wms',
            params: {'LAYERS': 'web_test:london', 'TILED': true},
            serverType: 'geoserver',
          }),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 1,
      })
    })
  }

  setTarget (target: string | null): void {
    this._map.setTarget('force a refresh')
    this._map.setTarget(target as any)
  }

  setView (lon:number, lat:number): void {
    this.map.getView().setCenter([lon, lat]);
    this.map.getView().setZoom(17);
  }

  addLayer(lon:number, lat:number, name: string): BaseLayer {
    let layer = new olLayer.Vector({
      source: new olSource.Vector({
          features: [
              new Feature({
                  geometry: new olGeom.Point([lon, lat])
              })
          ]
      }),
      style: new olStyle.Style({
        image: new olStyle.Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'https://icons.iconarchive.com/icons/iron-devil/ids-icon-plant/32/IDs-Icon-Plant-icon.png'
        })
      })
    });
    layer.set('name', name)
    this.map.addLayer(layer)
    this.setView(lon, lat)
    return layer
  }

  addBaseLayer(layer: BaseLayer): void {
    this.map.addLayer(layer)
  }

}
