import { Products } from "../product/product.interface";
import { Users } from "../user/users.interface";

export interface Sales {
  id?: number,
  id_company?: number,
  id_user?: number,
  total?: number,
  status?: 'AB' | 'FE' | 'CA',
  date_hour?: string,
  deleted?: string,
  products?: SaleProduct[]
  user?: Users
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
  total: number,
  product?: Products
}

export interface SalesProducRequest {
  filter?: SaleProduct
  limit?: number;
  search?: string;
}
