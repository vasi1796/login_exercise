import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LandRegistryTitle } from 'src/app/models/LandRegistryTitle';
import { ApiService } from '../../services/api.service';
import { MapService } from '../../services/map.service';
import { LayerService } from '../../services/layer.service';
import BaseLayer from 'ol/layer/Base';

@Component({
  selector: 'map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss']
})
export class MapPageComponent implements OnInit {
  titleId: string = ''
  landTitle: LandRegistryTitle | undefined = undefined
  maxSlider: number = 1.0
  minSlider: number = 0.0
  sliderStepSize: number = 0.1
  @ViewChild('map', { static: true }) mapRef!: ElementRef

  get availableLayers() {
    return this.layerService.layers
  }

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private layerService: LayerService,
    private mapService: MapService
    ){
      this.activatedRoute.queryParams.subscribe(params => {
        this.titleId = params['id']
        this.apiService.getTableData().subscribe(data => {
          data.map(d => {
            if(d.title_no === this.titleId) {
              this.landTitle = d
              this.layerService.addLayer(this.landTitle?.x, this.landTitle?.y, this.landTitle.title_no)
            }
          })
        })
      })
    }

  ngOnInit() {
    this.mapService.setTarget('map')
  }

  toggleVisibility(layer: BaseLayer): void {
    layer.setVisible(!layer.getVisible())
  }

  removeLayer(layer: BaseLayer): void {
    this.layerService.removeLayer(layer)
  }

  setLayerOpacity(value: number, layer: BaseLayer): void {
    layer.setOpacity(value)
  }

  routeBack(): void {
    this.location.back()
  }
}
