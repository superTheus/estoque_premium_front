import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollerModule } from 'primeng/scroller';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user.routing';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { PasswordModule } from 'primeng/password';

@NgModule({
  declarations: [UserComponent, LoginComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    ScrollerModule,
    FormsModule,
    InputTextModule,
    PasswordModule
  ]
})
export class AppModule { }

