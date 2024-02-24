import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerModule } from 'primeng/scroller';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ProductComponent } from './product/product.component';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from '../../containers/layout/layout.module';

@NgModule({
  declarations: [AppComponent, ProductComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    ScrollerModule,
    PanelMenuModule,
    RatingModule,
    TagModule,
    DataViewModule
  ]
})
export class AppModule { }

