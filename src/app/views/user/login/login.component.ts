import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/auth.service';

import Swal from 'sweetalert2';
import { LoadService } from '../../../shared/load.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form!: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private loaderService: LoadService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {
    this.loaderService.show();
    this.authService.signIn({
      ...this.form.value,
      use_system: 'Y',
      ativo: 'S'
    }).then((data) => {
      this.router.navigate(['/app'])
      this.loaderService.hide();
    }).catch((error) => {
      Swal.fire("Email ou senha inválida", "", "error");
      this.loaderService.hide();
    })
  }
}
