import { Injectable } from '@angular/core';
import { catchError, from, throwError } from 'rxjs';

import { ApiService } from '../data/api.service';
import { clearSession, getUser, setCompanyId, setUser, setUserEmail, setUserId } from '../utils/util';
import { User } from './auth.interface';

export interface ISignInCredentials {
  email: string;
  password: string;
  use_system?: 'Y' | 'N';
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
  user!: User;

  constructor(
    private apiService: ApiService
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
    window.location.href = window.location.origin + '/user/login';
  }
}
