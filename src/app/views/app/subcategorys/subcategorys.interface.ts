import { Categorys } from "../brands/brands.interface";

export interface Subcategorys {
  id?: number;
  description: string;
  id_category: number;
  category?: Categorys;
  deleted?: 'S' | 'N';
}

export interface SubcategorysRequest {
  filter?: {
    id?: number;
    description?: string;
    deleted?: 'S' | 'N';
  };
  limit?: number;
}
