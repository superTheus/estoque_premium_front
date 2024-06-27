import { Permission, Users } from "../user/users.interface";

export interface Company {
  id?: number,
  cnpj?: string,
  razao_social?: string,
  nome_fantasia?: string,
  inscricao_estadual?: string,
  inscricao_municipal?: string,
  telefone?: string,
  email?: string,
  cep?: string,
  logradouro?: string,
  numero?: number,
  bairro?: string,
  cidade?: string,
  uf?: string,
  certificate?: string,
  certificate_name?: string,
  password?: string,
  csc?: string,
  csc_id?: string,
  type?: number
  permissions?: Permission,
  users?: Users[],
  ativo?: 'S' | 'N',
}

export interface CompanyRequest {
  filter?: Company;
  limit?: number;
}
