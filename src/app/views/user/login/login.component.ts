import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  login() {
    this.authService.signIn({
      email: this.email,
      password: this.password
    }).then((data) => {
      console.log('Usuário logado:', data);
      this.router.navigate(['app/box']);
    }).catch((error) => {
      console.error('Erro ao logar:', error);
    });

    // this.router.navigate(['app/box']);
  }
}
