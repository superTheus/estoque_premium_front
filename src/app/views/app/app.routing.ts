import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BoxComponent } from './box/box.component';

let routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'box', component: BoxComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
