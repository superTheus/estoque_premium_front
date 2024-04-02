import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutineComponent } from './routine.component';
import { MenuComponent } from './menu/menu.component';
import { StockComponent } from '../stock/stock.component';
import { SalesRoutineComponent } from './sales/salesRoutine.component';

const routes: Routes = [
  {
    path: '', component: RoutineComponent,
    children: [
      { path: '', redirectTo: 'menu', pathMatch: 'full' },
      { path: 'menu', component: MenuComponent },
      { path: 'sales', component: SalesRoutineComponent },
      { path: 'stock', component: StockComponent }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutineRoutingModule { }
