import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';

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
}
