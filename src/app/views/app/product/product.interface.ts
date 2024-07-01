import { Brands } from "../brands/brands.interface";
import { Categorys } from "../categorys/categorys.interface";
import { Subcategorys } from "../subcategorys/subcategorys.interface";
import { Suppliers } from "../supplier/supplier.interface";

export interface Products {
  id?: number,
  description?: string,
  id_company?: number,
  id_brand?: number,
  id_category?: number,
  id_subcategory?: number,
  price_sale?: number,
  price_cost?: number,
  ncm?: string,
  id_fornecedor?: number,
  control_stock?: 'S' | 'N',
  stock?: number,
  stock_minimum?: number,
  deleted?: 'S' | 'N';
  category?: Categorys;
  subcategory?: Subcategorys;
  brand?: Brands;
  suplier?: Suppliers;
  unidade?: string;
  cfop?: string;
  origem?: string;
  images?: {
    id?: number;
    id_product?: number;
    image: string;
  }[];
}

export interface ProductsRequest {
  filter?: Products;
  limit?: number;
  search?: string;
}
