import { Users } from "../user/users.interface";

export interface Box {
  id?: number;
  id_company?: number;
  id_user?: number;
  value_init?: number;
  value_debit?: number;
  value_credit?: number;
  value_money?: number;
  value_others?: number;
  observacoes?: string;
  status?: 'AB' | 'FE';
  date_hour?: string;
  user?: Users;
}

export interface BoxMov {
  id?: number;
  id_caixa?: number;
  value?: number;
  id_sale?: number;
}

export interface BoxRequest {
  filter?: Box;
  limit?: number;
}

export interface BoxMovRequest {
  filter?: BoxMov;
  limit?: number;
}
