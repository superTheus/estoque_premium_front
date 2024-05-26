import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HotkeyModule } from "angular2-hotkeys";
import { SimpleNotificationsModule } from 'angular2-notifications';

import { LayoutModule } from "../../../containers/layout/layout.module";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ApiService } from "../../../data/api.service";
import { ListComponent } from "./list/list.component";
import { ComponentsModule } from "../../../components/components.module";
import { SalesService } from "../../../data/sales.service";
import { BalanceService } from "../../../data/balance.service";
import { BoxComponent } from "./box.component";
import { CloseComponent } from "./close/close.component";
import { BoxRoutingModule } from "./box.routing";

@NgModule({
  declarations: [
    BoxComponent,
    CloseComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    BoxRoutingModule,
    LayoutModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    HotkeyModule.forRoot(),
    SimpleNotificationsModule.forRoot()
  ],
  providers: [ApiService, SalesService, BalanceService],
})
export class BoxModule { }
