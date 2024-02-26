import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { Brands, BrandsRequest } from '../views/app/brands/brands.interface';

interface User {
  name?: string,
  email: string,
  password: string,
  photo?: string,
  company?: number
}

interface UserRequest {
  filter?: User;
  limit?: number;
}

interface resultInterface {
  message: string;
  results: any;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {
  }

  getUser(user: UserRequest) {
    const url = `${environment.baseUrl}/user/list`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(url, user, { headers })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  findBrands(brands?: BrandsRequest): Promise<resultInterface> {
    const url = `${environment.baseUrl}/brands/list`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, brands, { headers })
        .pipe(
          map((res) => {
            return res as resultInterface;
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          res => {
            resolve(res as resultInterface);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  createBrands(brands: Brands): Promise<resultInterface> {
    const url = `${environment.baseUrl}/brands/insert`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, brands, { headers })
        .pipe(
          map((res) => {
            return res;
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          (res) => {
            resolve(res as resultInterface);
          },
          (error) => {
            reject(error);
          }
        );
    })
  }

  updateBrands(brands: Brands): Promise<resultInterface> {
    const url = `${environment.baseUrl}/brands/update/` + brands.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.put(url, brands, { headers })
        .pipe(
          map((res) => {
            return res;
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          (res) => {
            resolve(res as resultInterface);
          },
          (error) => {
            reject(error);
          }
        );
    })
  }
}
