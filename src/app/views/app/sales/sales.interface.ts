import { Clients } from "../client/client.interface";
import { Products } from "../product/product.interface";
import { Users } from "../user/users.interface";

export interface Sales {
  id?: number,
  id_company?: number,
  id_user?: number,
  id_seller?: number | null,
  id_client?: number | null,
  total?: number,
  status?: 'AB' | 'FE' | 'CA',
  date_hour?: string,
  deleted?: string,
  products?: SaleProduct[]
  user?: Users,
  seller?: Users,
  client?: Clients,
  payforms?: SalePayForm[];
  date_init?: string;
  date_end?: string;
}

interface PayForm {
  id: number,
  description: string,
}

export interface SalePayForm {
  id?: number,
  id_sale?: number,
  id_form: number,
  value: number,
  date: string,
  portion_number: number,
  portion_total: number,
  payform?: PayForm
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
