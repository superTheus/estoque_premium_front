import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewsComponent } from './views.component';
import { ViewRoutingModule } from './views.routes';

@NgModule({
  declarations: [ViewsComponent],
  imports: [
    CommonModule,
    ViewRoutingModule,
  ]
})

export class ViewsModule { }
