import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { ComponentsModule } from '../../../components/components.module';
import { ProductRoutingModule } from './product.routing';
import { LyCommonModule } from '@alyle/ui';



@NgModule({
  declarations: [
    ListComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
    LyCommonModule
  ]
})
export class ProductModule { }
