import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { TablePageComponent } from './pages/table-page/table-page.component';

const routes: Routes = [
  { path: 'table', component: TablePageComponent },
  { path: 'map', component: MapPageComponent },
  { path: '',   redirectTo: '/table', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
