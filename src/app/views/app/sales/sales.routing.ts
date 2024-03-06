import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from './sales.component';
import { PdvComponent } from './pdv/pdv.component';
import { ListComponent } from './list/list.component';

let routes: Routes = [
  {
    path: '',
    component: SalesComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ListComponent },
      { path: 'pdv', component: PdvComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule { }
