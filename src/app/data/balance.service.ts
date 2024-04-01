import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Products, ProductsRequest } from "../views/app/product/product.interface";
import { environment } from "../environments/environment";
import { catchError, map, throwError } from "rxjs";
import { getCompanyId } from "../utils/util";

interface resultInterface {
  message: string;
  results: any;
}

@Injectable({ providedIn: 'root' })
export class BalanceService {
  constructor(private http: HttpClient) {
  }

  async newMoviment(product: Products, balance: number) {
    await this.insertBalance(product, balance);
  }

  private changeStock(product: Products): Promise<resultInterface> {
    const url = `${environment.baseUrl}/products/update/` + product.id;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.put(url, product, { headers })
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

  private getProduct(id: number): Promise<resultInterface> {
    const url = `${environment.baseUrl}/products/list`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, {
        filter: {
          id: id
        }
      }, { headers })
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

  private async insertBalance(product: Products, balance: number): Promise<resultInterface> {
    var currentProduct = (await this.getProduct(product.id as number)).results[0] as Products;
    product.stock = (currentProduct.stock ?? 0) - balance;

    this.changeStock(product);

    const url = `${environment.baseUrl}/balance/insert`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, {
        id_product: currentProduct.id,
        id_company: getCompanyId(),
        balance_preview: currentProduct.stock,
        balance_new: product.stock,
      }, { headers })
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
}
