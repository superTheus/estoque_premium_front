import { Products } from "../product/product.interface";

export interface Sales {
  id?: number,
  id_company?: number,
  id_user?: number,
  total?: number,
  deleted?: string,
  products?: Products[]
}

export interface SalesRequest {
  filter?: Sales
  limit?: number;
  search?: string;
}

export interface SaleProduct {
  id: number,
  id_product: number,
  id_sale: number,
  quantity: number,
  desconto: number,
  desconto_percentual: number,
  total: number
}

export interface SalesProducRequest {
  filter?: SaleProduct
  limit?: number;
  search?: string;
}
