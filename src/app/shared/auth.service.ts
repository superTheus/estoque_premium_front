import { Injectable } from '@angular/core';
import { catchError, from, throwError } from 'rxjs';

import { ApiService } from '../data/api.service';

export interface ISignInCredentials {
  email: string;
  password: string;
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
  constructor(
    private apiService: ApiService
  ) { }

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
        data => resolve(data),
        error => reject(error)
      )
    });
  }
}
