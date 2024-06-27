import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { catchError, map, throwError } from "rxjs";
import { CestInterface, CfopInterface, CompanyFiscalInterface, FormasPagamentoInterface, IbptInterface, NcmInterface, SituacaoTributariaInterface } from "../utils/interfcaes";

@Injectable({ providedIn: 'root' })
export class FiscalService {
  constructor(private http: HttpClient) {
  }

  testCertificate(data: {
    certificado: string;
    senha: string;
  }): Promise<{
    mensagem: string;
    sucesso: boolean
  }> {
    const url = `${environment.emissorUrl}/fiscal/certicate/test`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, data, { headers })
        .pipe(
          map((res) => {
            return res as {
              mensagem: string;
              sucesso: boolean
            };
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          res => {
            resolve(res as {
              mensagem: string;
              sucesso: boolean
            });
          },
          error => {
            reject(error);
          }
        );
    });
  }

  listCest(): Promise<CestInterface[]> {
    const url = `${environment.emissorUrl}/cest`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, {}, { headers })
        .pipe(
          map((res) => {
            return res as CestInterface[];
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          res => {
            resolve(res as CestInterface[]);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  listIbpt(): Promise<IbptInterface[]> {
    const url = `${environment.emissorUrl}/ibpt`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, {}, { headers })
        .pipe(
          map((res) => {
            return res as IbptInterface[];
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          res => {
            resolve(res as IbptInterface[]);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  listNcm(): Promise<NcmInterface[]> {
    const url = `${environment.emissorUrl}/ncm`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, {}, { headers })
        .pipe(
          map((res) => {
            return res as NcmInterface[];
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          res => {
            resolve(res as NcmInterface[]);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  listSituacaoTributaria(): Promise<SituacaoTributariaInterface[]> {
    const url = `${environment.emissorUrl}/situacao`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, {}, { headers })
        .pipe(
          map((res) => {
            return res as SituacaoTributariaInterface[];
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          res => {
            resolve(res as SituacaoTributariaInterface[]);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  listCfop(): Promise<CfopInterface[]> {
    const url = `${environment.emissorUrl}/cfop`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, {}, { headers })
        .pipe(
          map((res) => {
            return res as CfopInterface[];
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          res => {
            resolve(res as CfopInterface[]);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  listFormas(): Promise<FormasPagamentoInterface[]> {
    const url = `${environment.emissorUrl}/formas`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, {}, { headers })
        .pipe(
          map((res) => {
            return res as FormasPagamentoInterface[];
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          res => {
            resolve(res as FormasPagamentoInterface[]);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  listCompanyFiscal(filter: { cnpj: string }): Promise<CompanyFiscalInterface[]> {
    const url = `${environment.emissorUrl}/company/list`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, {
        filter: filter
      }, { headers })
        .pipe(
          map((res) => {
            return res as CompanyFiscalInterface[];
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          res => {
            resolve(res as CompanyFiscalInterface[]);
          },
          error => {
            reject(error);
          }
        );
    });
  }

  createCompanyFiscal(company: CompanyFiscalInterface): Promise<CompanyFiscalInterface[]> {
    const url = `${environment.emissorUrl}/company/create`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return new Promise((resolve, reject) => {
      this.http.post(url, company, { headers })
        .pipe(
          map((res) => {
            return res as CompanyFiscalInterface[];
          }),
          catchError(errorRes => {
            return throwError(errorRes);
          })
        ).subscribe(
          res => {
            resolve(res as CompanyFiscalInterface[]);
          },
          error => {
            reject(error);
          }
        );
    });
  }
}
