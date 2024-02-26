import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonDefaultComponent } from './button-default/button-default.component';
import { InputDefaultComponent } from './input-default/input-default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ButtonDefaultComponent, InputDefaultComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ButtonDefaultComponent, InputDefaultComponent]
})
export class ComponentsModule { }
