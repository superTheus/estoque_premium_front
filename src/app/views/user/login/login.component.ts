import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/auth.service';
import { getCompanyId } from '../../../utils/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email = new FormControl('');
  password = new FormControl('');

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  login() {
    this.authService.signIn({
      email: this.email.value || '',
      password: this.password.value || ''
    }).then((data) => {
      this.router.navigate(['/app'])
    }).catch((error) => {
      console.error('login -> error', error);
    })
  }
}
