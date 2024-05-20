import { Company } from "../company/company.interface";

export interface Users {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  profile?: 'ADMIN' | 'STORE';
  use_system?: 'Y' | 'N';
  ativo?: 'S' | 'N';
  company?: number;
  companyData?: Company;
  lastpassword?: {
    id: number;
    id_user: number;
    last_pass: string;
  },
  permissions?: Permission;
  type?: 'owner' | 'simple';
}

export interface Permission {
  id?: number;
  id_user?: number;
  id_company?: number;
  nome_empresa?: string;
  responsavel?: string;
  telefone?: string;
  email?: string;
  valor_mensal?: number;
  limite_nfce?: number;
  limite_nfe?: number;
  limite_empresas?: number;
  limite_usuarios?: number;
  limite_produtos?: number;
  limite_clientes?: number;
  date_expiration?: string;
}

export interface UsersRequest {
  filter?: Users;
  limit?: number;
}

export interface PermissionRequest {
  filter?: Permission;
  limit?: number;
}
