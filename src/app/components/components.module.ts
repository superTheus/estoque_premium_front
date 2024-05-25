import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDefaultComponent } from './button-default/button-default.component';
import { InputDefaultComponent } from './input-default/input-default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDefaultComponent } from './select-default/select-default.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputQuantityComponent } from './input-quantity/input-quantity.component';
import { ChartComponent } from './chart/chart.component';
import { DeniedComponent } from './denied/denied.component';
import { LoadComponent } from './load/load.component';

@NgModule({
  declarations: [ButtonDefaultComponent, InputDefaultComponent, SelectDefaultComponent, InputQuantityComponent, ChartComponent, DeniedComponent, LoadComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule
  ],
  exports: [ButtonDefaultComponent, InputDefaultComponent, SelectDefaultComponent, InputQuantityComponent, ChartComponent, DeniedComponent, LoadComponent]
})
export class ComponentsModule { }
