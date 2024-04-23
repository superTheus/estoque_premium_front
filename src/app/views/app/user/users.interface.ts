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
  }
}

export interface UsersRequest {
  filter?: Users;
  limit?: number;
}
