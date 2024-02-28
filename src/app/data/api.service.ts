import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { Brands, BrandsRequest, Categorys, CategorysRequest } from '../views/app/brands/brands.interface';
import { Subcategorys, SubcategorysRequest } from '../views/app/subcategorys/subcategorys.interface';
import { Suppliers, SuppliersRequest } from '../views/app/supplier/supplier.interface';

interface User {
  id?: number,
  name?: string,
  email?: string,
  password?: string,
  photo?: string,
  company?: number,
  ativo?: 'S' | 'N';
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

  createUser(user: User): Promise<resultInterface> {
    const url = `${environment.baseUrl}/user/insert`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, user, { headers })
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

  updateUser(user: User): Promise<resultInterface> {
    const url = `${environment.baseUrl}/user/update/` + user.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.put(url, user, { headers })
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

  findCategorys(categorys?: CategorysRequest): Promise<resultInterface> {
    const url = `${environment.baseUrl}/categorys/list`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, categorys, { headers })
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

  createCategory(category: Categorys): Promise<resultInterface> {
    const url = `${environment.baseUrl}/categorys/insert`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, category, { headers })
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

  updateCategory(category: Categorys): Promise<resultInterface> {
    const url = `${environment.baseUrl}/categorys/update/` + category.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.put(url, category, { headers })
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

  findSubcategorys(subcategorys?: SubcategorysRequest): Promise<resultInterface> {
    const url = `${environment.baseUrl}/subcategorys/list`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, subcategorys, { headers })
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

  createSubcategory(subcategory: Subcategorys): Promise<resultInterface> {
    const url = `${environment.baseUrl}/subcategorys/insert`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, subcategory, { headers })
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

  updateSubcategory(subcategory: Subcategorys): Promise<resultInterface> {
    const url = `${environment.baseUrl}/subcategorys/update/` + subcategory.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.put(url, subcategory, { headers })
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

  findSuppliers(supplier?: SuppliersRequest): Promise<resultInterface> {
    const url = `${environment.baseUrl}/supplier/list`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, supplier, { headers })
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

  createSupplier(supplier: Suppliers): Promise<resultInterface> {
    const url = `${environment.baseUrl}/supplier/insert`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, supplier, { headers })
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

  updateSupplier(supplier: Suppliers): Promise<resultInterface> {
    const url = `${environment.baseUrl}/supplier/update/` + supplier.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.put(url, supplier, { headers })
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
