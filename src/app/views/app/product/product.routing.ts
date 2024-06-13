import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductComponent } from './product.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
  {
    path: '', component: ProductComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: ListComponent },
      { path: 'create', component: CreateComponent },
      { path: 'edit/:id', component: CreateComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule { }
