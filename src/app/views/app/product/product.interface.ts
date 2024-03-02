export interface Products {
  id?: number,
  description: string,
  id_company: number,
  id_brand: number,
  id_category: number,
  id_subcategory: number,
  price_sale: number,
  price_cost: number,
  ncm: string,
  id_fornecedor: number,
  control_stock: string,
  stock: number,
  deleted?: 'S' | 'N';
}

export interface ProductsRequest {
  filter?: Products;
  limit?: number;
}
