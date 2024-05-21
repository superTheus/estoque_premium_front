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

@NgModule({
  declarations: [ButtonDefaultComponent, InputDefaultComponent, SelectDefaultComponent, InputQuantityComponent, ChartComponent, DeniedComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FloatLabelModule
  ],
  exports: [ButtonDefaultComponent, InputDefaultComponent, SelectDefaultComponent, InputQuantityComponent, ChartComponent, DeniedComponent]
})
export class ComponentsModule { }
