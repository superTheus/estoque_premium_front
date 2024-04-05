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
import { UserComponent } from './user/user.component';
import { ComponentsModule } from '../../components/components.module';
import { BrandsComponent } from './brands/brands.component';
import { ApiService } from '../../data/api.service';
import { CategorysComponent } from './categorys/categorys.component';
import { SubcategorysComponent } from './subcategorys/subcategorys.component';
import { SuppliersComponent } from './supplier/supplier.component';
import { ClientComponent } from './client/client.component';
import { ContasComponent } from './contas/contas.component';
import { PaymentComponent } from './payment/payment.component';
import { ReceiveComponent } from './receive/receive.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { BoxComponent } from './box/box.component';
import { CompanyComponent } from './company/company.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { StockComponent } from './stock/stock.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    UserComponent,
    BrandsComponent,
    CategorysComponent,
    SubcategorysComponent,
    SuppliersComponent,
    ClientComponent,
    ContasComponent,
    PaymentComponent,
    ReceiveComponent,
    DashboardsComponent,
    BoxComponent,
    CompanyComponent,
    StockComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    ScrollerModule,
    PanelMenuModule,
    RatingModule,
    TagModule,
    DataViewModule,
    ComponentsModule,
    ToggleButtonModule
  ],
  providers: [ApiService],
})
export class AppModule { }

