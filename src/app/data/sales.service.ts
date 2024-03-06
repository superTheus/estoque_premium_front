import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { SaleProduct, Sales, SalesProducRequest, SalesRequest } from '../views/app/sales/sales.interface';


interface resultInterface {
  message: string;
  results: any;
}

@Injectable({ providedIn: 'root' })
export class SalesService {

  public currentSale!: Sales;

  constructor(private http: HttpClient) {
  }

  findSales(sales?: SalesRequest): Promise<resultInterface> {
    const url = `${environment.baseUrl}/sales/list`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, sales, { headers })
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

  createSale(sale: Sales): Promise<resultInterface> {
    const url = `${environment.baseUrl}/sales/insert`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, sale, { headers })
        .pipe(
          map((res) => {
            return res;
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          (res) => {
            const response = res as resultInterface;

            if (response.results) {
              this.currentSale = response.results as Sales;
            }

            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    })
  }

  updateSale(sale: Sales): Promise<resultInterface> {
    const url = `${environment.baseUrl}/sales/update/` + sale.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.put(url, sale, { headers })
        .pipe(
          map((res) => {
            return res;
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          (res) => {
            const response = res as resultInterface;

            if (response.results) {
              this.currentSale = response.results as Sales;
            }
            resolve(res as resultInterface);
          },
          (error) => {
            reject(error);
          }
        );
    })
  }

  findSalesProducts(sales?: SalesProducRequest): Promise<resultInterface> {
    const url = `${environment.baseUrl}/sales/products/list`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, sales, { headers })
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

  addProduct(product: SaleProduct): Promise<resultInterface> {
    const url = `${environment.baseUrl}/sales/products/insert`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, product, { headers })
        .pipe(
          map((res) => {
            return res;
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          (res) => {
            const response = res as resultInterface;

            if (response.results) {
              this.currentSale = response.results as Sales;
            }

            resolve(response);
          },
          (error) => {
            reject(error);
          }
        );
    })
  }

  updateProduct(sale: Sales): Promise<resultInterface> {
    const url = `${environment.baseUrl}/sales/products/update/` + sale.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.put(url, sale, { headers })
        .pipe(
          map((res) => {
            return res;
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          (res) => {
            const response = res as resultInterface;

            if (response.results) {
              this.currentSale = response.results as Sales;
            }
            resolve(res as resultInterface);
          },
          (error) => {
            reject(error);
          }
        );
    })
  }

  deleteProduct(product: SaleProduct): Promise<resultInterface> {
    const url = `${environment.baseUrl}/sales/delete/` + product.id;

    return new Promise((resolve, reject) => {
      this.http.delete(url)
        .pipe(
          map((res) => {
            return res;
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          (res) => {
            const response = res as resultInterface;

            if (response.results) {
              this.currentSale = response.results as Sales;
            }
            resolve(res as resultInterface);
          },
          (error) => {
            reject(error);
          }
        );
    })
  }
}
