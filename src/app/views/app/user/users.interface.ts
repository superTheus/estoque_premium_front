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
  permissao?: PermissionData;
  dateLogin?: string,
}

export interface PermissionData {
  id?: number;
  user?: number;
  showMenuRegister: 0 | 1,
  managerUsers: 0 | 1,
  managerSuppliers: 0 | 1,
  managerClientes: 0 | 1,
  managerProdutos: 0 | 1,
  managerBrands: 0 | 1,
  managerCategories: 0 | 1,
  managerSubcategories: 0 | 1,
  showMenuBox: 0 | 1,
  managerBox: 0 | 1,
  showMenuSales: 0 | 1,
  managerSales: 0 | 1,
  showMenuReports: 0 | 1,
  showReportsSales: 0 | 1,
  showReportsStock: 0 | 1,
  showMenuStock: 0 | 1,
  managerEntries: 0 | 1,
  showMenuFinance: 0 | 1,
  managerFinance: 0 | 1,
  managerAccount: 0 | 1,
  issueNfe: 0 | 1,
}

export interface Permission {
  id?: number;
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
