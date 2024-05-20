import { Injectable } from '@angular/core';
import { catchError, from, throwError } from 'rxjs';

import { ApiService } from '../data/api.service';
import { clearSession, getUser, setCompanyId, setPermision, setUser, setUserEmail, setUserId } from '../utils/util';
import { Router } from '@angular/router';
import { Users } from '../views/app/user/users.interface';

export interface ISignInCredentials {
  email: string;
  password: string;
  use_system?: 'Y' | 'N';
  ativo: 'S' | 'N';
}

export interface ICreateCredentials {
  email: string;
  password: string;
  displayName: string;
}

export interface IPasswordReset {
  code: string;
  newPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user!: Users;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    let user = getUser();

    if (user)
      this.user = user;
  }

  signIn(credentials: ISignInCredentials) {
    return new Promise((resolve, reject) => {
      this.apiService.getUser({
        filter: credentials
      }).pipe(
        catchError((error) => {
          console.error('Erro na requisição:', error);
          return throwError(error);
        })
      ).subscribe(
        (data: any) => {
          let result = data.results[0];

          this.user = data.results[0];
          this.user.dateLogin = new Date().toISOString();

          this.apiService.findPermission({
            filter: {
              id_company: result.company,
            }
          }).then(data => {
            if (data.results.length) {
              setPermision(data.results[0]);
            }
          })

          setUser(this.user);
          setCompanyId(result.company);
          setUserId(result.id);
          setUserEmail(result.email);
          resolve(data);
        },
        error => reject(error)
      )
    });
  }

  lougtOut() {
    clearSession();
    this.user = getUser();
    this.router.navigate(['/user/login']);
  }
}
