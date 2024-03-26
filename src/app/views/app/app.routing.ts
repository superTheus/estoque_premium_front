import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BoxComponent } from './box/box.component';
import { SalesComponent } from './sales/sales.component';
import { ShoppComponent } from './shopp/shopp.component';
import { RoutineComponent } from './routine/routine.component';
import { StockComponent } from './stock/stock.component';
import { FinanceComponent } from './finance/finance.component';
import { UserComponent } from './user/user.component';
import { ProductComponent } from './product/product.component';
import { ClientComponent } from './client/client.component';
import { BrandsComponent } from './brands/brands.component';
import { CategorysComponent } from './categorys/categorys.component';
import { SubcategorysComponent } from './subcategorys/subcategorys.component';
import { SuppliersComponent } from './supplier/supplier.component';
import { ContasComponent } from './contas/contas.component';
import { PaymentComponent } from './payment/payment.component';
import { ReceiveComponent } from './receive/receive.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { CompanyComponent } from './company/company.component';

let routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: 'dashboards', pathMatch: 'full' },
      { path: 'dashboards', component: DashboardsComponent },
      { path: 'brands', component: BrandsComponent },
      { path: 'categorys', component: CategorysComponent },
      { path: 'subcategorys', component: SubcategorysComponent },
      { path: 'suppliers', component: SuppliersComponent },
      { path: 'box', component: BoxComponent },
      { path: 'sales', loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule) },
      { path: 'shopp', component: ShoppComponent },
      { path: 'routine', component: RoutineComponent },
      { path: 'stock', component: StockComponent },
      { path: 'finance', component: FinanceComponent },
      { path: 'user', component: UserComponent },
      { path: 'product', component: ProductComponent },
      { path: 'client', component: ClientComponent },
      { path: 'contas', component: ContasComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'receive', component: ReceiveComponent },
      { path: 'company', component: CompanyComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
