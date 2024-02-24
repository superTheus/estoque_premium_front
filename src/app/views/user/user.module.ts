import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerModule } from 'primeng/scroller';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user.routing';
import { LoginComponent } from './login/login.component';
import { ButtonDefaultComponent } from '../../components/button-default/button-default.component';
import { InputDefaultComponent } from '../../components/input-default/input-default.component';


@NgModule({
  declarations: [UserComponent, LoginComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    ScrollerModule,
    ButtonDefaultComponent,
    InputDefaultComponent
  ]
})
export class UserModule { }

