import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Products, ProductsRequest } from "../views/app/product/product.interface";
import { environment } from "../environments/environment";
import { catchError, map, throwError } from "rxjs";
import { getCompanyId } from "../utils/util";
import { Users } from "../views/app/user/users.interface";

interface resultInterface {
  message: string;
  results: any;
}

export interface ProductsInputs {
  id_product: number,
  quantity: number
  product?: Products
}

export interface Inputs {
  id?: number,
  documento: string,
  id_user: number,
  id_company: number,
  date_hour?: string,
  products: ProductsInputs[],
  user?: Users
}

export interface InputsRequest {
  filter?: {
    id?: number,
    id_company: number,
    id_user?: number,
    documento?: string
  };
  limit?: number;
  order?: {
    field: string,
    order: string
  };
}

export interface Moviment {
  id: number,
  id_product: number,
  id_company: number,
  balance_preview: number,
  balance_new: number,
  type: 'C' | 'S' | 'I',
  date_hour: string,
}

export interface MovimentRequest {
  filter?: {
    id?: number,
    id_product?: number,
    id_company: number,
  };
  limit?: number;
  order?: {
    field: string,
    order: string
  };
}

@Injectable({ providedIn: 'root' })
export class BalanceService {
  constructor(private http: HttpClient) {
  }

  async firstMoviment(product: Products, balance: number) {
    const url = `${environment.baseUrl}/balance/insert`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, {
        id_product: product.id,
        id_company: getCompanyId(),
        balance_preview: 0,
        balance_new: balance,
        type: 'C'
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


  async insertInputs(input: Inputs): Promise<Inputs> {
    return new Promise((resolve, reject) => {
      this.Inputs(input).then(res => {
        const result = res.results as Inputs;

        Promise.all(result.products.map(product => {
          return this.insertBalance({ id: product.id_product }, product.quantity, 'I', 'PLUS');
        })).then(() => {
          resolve(result);
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    })
  }

  async findInputs(params: InputsRequest): Promise<resultInterface> {
    const url = `${environment.baseUrl}/inputs/list`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, params, { headers })
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

  private async Inputs(input: Inputs): Promise<resultInterface> {
    const url = `${environment.baseUrl}/inputs/insert`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, input, { headers })
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

  async findMoviment(params: MovimentRequest): Promise<resultInterface> {
    const url = `${environment.baseUrl}/balance/list`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, params, { headers })
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

  async newMoviment(product: Products, balance: number, type: 'C' | 'S' | 'I') {
    await this.insertBalance(product, balance, type);
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

  private async insertBalance(product: Products, balance: number, type: 'C' | 'S' | 'I', model: 'PLUS' | 'MINUS' = 'MINUS'): Promise<resultInterface> {
    var currentProduct = (await this.getProduct(product.id as number)).results[0] as Products;
    product = { ...currentProduct };

    if (model === 'PLUS') {
      product.stock = (Number(currentProduct.stock) ?? 0) + Number(balance);
    }

    if (model === 'MINUS') {
      product.stock = (Number(currentProduct.stock) ?? 0) - Number(balance);
    }

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
        type: type
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
