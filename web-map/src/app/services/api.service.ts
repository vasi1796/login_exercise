import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {LandRegistryTitle} from '../models/LandRegistryTitle'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTableData() : Observable<LandRegistryTitle[]> {
    const tableData = this.http.get<LandRegistryTitle[]>(`${this.baseUrl}/titledata/testdata.json`)
    .pipe(
      map((titles: any[]) => {
          return titles.map(t => {
            return new LandRegistryTitle(
              t['Title Number'],
              t['Property Address'],
              t['Tenure'],
              t['X'],
              t['Y']
            )
          })
        }
      )
    )
    return tableData
  }
}
