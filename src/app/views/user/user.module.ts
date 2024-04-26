import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerModule } from 'primeng/scroller';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user.routing';
import { LoginComponent } from './login/login.component';
import { ComponentsModule } from '../../components/components.module';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [UserComponent, LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    ScrollerModule,
    ComponentsModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class UserModule { }

