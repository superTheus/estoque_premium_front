import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewsComponent } from './views.component';
import { AuthGuard } from '../shared/auth.guard';

let routes: Routes = [
  {
    path: '',
    component: ViewsComponent,
    children: [
      { path: '', redirectTo: 'user/login', pathMatch: 'full' },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
      },
      {
        path: 'app',
        loadChildren: () => import('./app/app.module').then((m) => m.AppModule),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewRoutingModule { }
