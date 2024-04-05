import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutineRoutingModule } from './routine.routing';
import { RoutineComponent } from './routine.component';
import { MenuComponent } from './menu/menu.component';
import { SalesRoutineComponent } from './sales/salesRoutine.component';
import { ComponentsModule } from '../../../components/components.module';
import { StockComponent } from './stock/stock.component';



@NgModule({
  declarations: [RoutineComponent, MenuComponent, SalesRoutineComponent, StockComponent],
  imports: [
    CommonModule,
    RoutineRoutingModule,
    ComponentsModule
  ]
})
export class RoutineModule { }
