import { Company } from "../views/app/company/company.interface";

export interface User {
  id: number,
  name: string,
  email: string,
  password: string,
  photo?: string,
  profile: string,
  use_system: string,
  company: 1,
  ativo: string,
  dateLogin: string,
  companyData: Company
}
