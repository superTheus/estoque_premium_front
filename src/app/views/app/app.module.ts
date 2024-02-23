import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerModule } from 'primeng/scroller';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    ScrollerModule
  ]
})
export class AppModule { }

