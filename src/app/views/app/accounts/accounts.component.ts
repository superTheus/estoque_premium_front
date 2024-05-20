import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../data/api.service';
import { getCompanyId, getPermision, setPermision } from '../../../utils/util';

import Swal from 'sweetalert2';
import { Options } from '../../../components/select-default/select-default.interface';
import { AuthService } from '../../../shared/auth.service';
import { UtilsService } from '../../../shared/utils.service';
import { Company } from '../company/company.interface';
import { Permission, Users } from '../user/users.interface';

declare const $: any;

@Component({
  selector: 'app-user',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountComponent {
  code = new FormControl('');

  document = new FormControl('', [Validators.required]);
  telephone = new FormControl('', [Validators.required]);

  name = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  profile = new FormControl('');
  email = new FormControl('');
  password = new FormControl('');

  use_system = true;

  profileOptions: Options[] = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'STORE', label: 'Vendedor' }
  ]

  isEditMode = false;
  companySelected?: Company;
  userSelected?: Users;
  data: Company[] = [];

  responsavel = new FormControl('');
  nome_empresa = new FormControl('');
  telefone = new FormControl('');
  emailPermission = new FormControl('');
  valor_mensal = new FormControl('');
  limite_nfe = new FormControl('');
  limite_nfce = new FormControl('');
  limite_empresas = new FormControl('');
  limite_usuarios = new FormControl('');
  limite_produtos = new FormControl('');
  limite_clientes = new FormControl('');
  date_expiration = new FormControl('');

  isEditModePermission = false;

  permissions = getPermision();
  disableNew = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    public utilsService: UtilsService
  ) {

    this.apiService.getUser({
      filter: {
        ativo: 'S',
        company: getCompanyId()
      }
    }).subscribe(res => {
      if (this.permissions?.limite_usuarios) {
        this.disableNew = this.permissions?.limite_usuarios <= res.results.length ? true : false;
      }
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    let filter: Company = {
      type: 2,
      ativo: 'S',
    }

    if (Number(this.code.value)) {
      filter.id = Number(this.code.value);
    }

    this.apiService.findCompany({
      filter: filter
    }).then(
      (res: any) => {
        this.data = res.results;
        console.log(this.data);
      },
      (error) => {
        this.data = [];
        console.log(error);
      }
    )
  }

  save() {
    this.isEditMode ? this.updateCompany() : this.createCompany();
    $('#modalUser').modal('hide');
  }

  openModal() {
    this.name.setValue('');
    this.lastName.setValue('');
    this.email.setValue('');
    this.password.setValue('');
    this.document.setValue('');
    this.telephone.setValue('');
    this.profile.setValue('');
    this.isEditMode = false;
    $('#modalUser').modal('show');
  }

  createCompany() {
    this.apiService.createCompany({
      nome: this.name.value || '',
      sobrenome: this.lastName.value || '',
      cnpj: this.document.value?.replace(/[^\d]+/g, ''),
      telefone: this.telephone.value?.replace(/[^\d]+/g, ''),
      email: this.email.value ?? '',
    }).then((res) => {
      let pass = this.utilsService.generatePassword(res.results.id);
      this.apiService.createUser({
        name: this.name.value + ' ' + this.lastName.value,
        email: this.email.value ?? '',
        password: pass,
        profile: 'ADMIN',
        company: res.results.id,
        use_system: 'Y',
        type: 'owner'
      }).then((res) => {
        this.apiService.createLastPass({
          id_user: res.results.id,
          last_pass: pass
        }).then((res) => {
          this.load();
        });
      });
    });
  }

  updateCompany() {
    let company = this.companySelected as Company;
    company.cnpj = this.document.value?.replace(/[^\d]+/g, '') as string;
    company.telefone = this.telephone.value?.replace(/[^\d]+/g, '') as string;
    company.email = this.email.value ?? '';

    company.nome = this.name.value ?? '';
    company.sobrenome = this.lastName.value ?? '';
    company.email = this.email.value ?? '';

    Promise.all([this.apiService.updateCompany(company)])
  }

  update(company: Company) {
    this.companySelected = company;
    this.userSelected = company.users?.find(user => user.type === 'owner');

    this.name.setValue(company.nome ?? '');
    this.lastName.setValue(company.sobrenome ?? '');
    this.email.setValue(company.email ?? null);

    this.document.setValue(this.utilsService.formatDocument(company.cnpj));
    this.telephone.setValue(this.utilsService.formatPhoneNumber(company.telefone));
    this.password.setValue(this.userSelected?.lastpassword?.last_pass ?? null);

    this.isEditMode = true;
    $('#modalUser').modal('show');
  }

  delete(company: Company) {
    Swal.fire({
      title: "Realmente deseja deletar esta conta?",
      showDenyButton: true,
      confirmButtonText: "Sim Deletar",
      denyButtonText: `Não, cancelar`,
      confirmButtonColor: '#d33',
      denyButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.updateCompany({
          id: company?.id,
          ativo: 'N'
        }).then((res) => {
          this.load();

          if (company.users) {
            Promise.all(company.users.map(user => {
              return this.apiService.updateUser({
                id: user.id,
                ativo: 'N',
                use_system: user.use_system,
                profile: user.profile,
              });
            }))
          };

          Swal.fire("Conta deletada", "", "info");
        });
      }
    });
  }

  formatDocument() {
    if (this.document.value) {
      this.document.setValue(this.utilsService.formatDocument(this.document.value));
    }
  }

  formatTelefone() {
    if (this.telephone.value) {
      this.telephone.setValue(this.utilsService.formatPhoneNumber(this.telephone.value));
    }

    if (this.telefone.value) {
      this.telefone.setValue(this.utilsService.formatPhoneNumber(this.telefone.value));
    }
  }

  formatCode() {
    if (this.code.value) {
      this.code.setValue(this.code.value.replace(/[^\d]+/g, ''));
    }

    this.load();
  }

  generatePassword() {
    let pass = this.utilsService.generatePassword(String(this.companySelected?.id));
    this.apiService.createLastPass({
      id_user: this.userSelected?.id as number,
      last_pass: pass
    }).then((res) => {
      this.password.setValue(pass);
      let user = this.userSelected as Users;
      user.password = pass;
      this.apiService.updateUser(user)
      this.load();
    })
  }

  permission(company: Company) {
    this.companySelected = company;

    this.apiService.findPermission({
      filter: {
        id_user: company.id
      }
    }).then((res) => {
      let permission = res.results[0] as Permission;
      this.companySelected = {
        ...this.companySelected,
        permissions: permission
      };

      if (permission) {
        this.isEditModePermission = true;
        this.responsavel.setValue(permission?.responsavel ?? '');
        this.nome_empresa.setValue(permission?.nome_empresa ?? '');
        this.telefone.setValue(this.utilsService.formatPhoneNumber(permission?.telefone) ?? '');
        this.emailPermission.setValue(permission?.email ?? '');
        this.valor_mensal.setValue(permission.valor_mensal ? this.formatValueCurrency(permission.valor_mensal) : '');
        this.limite_nfe.setValue(String(permission?.limite_nfe) ?? '');
        this.limite_nfce.setValue(String(permission?.limite_nfce) ?? '');
        this.limite_empresas.setValue(String(permission?.limite_empresas) ?? '');
        this.limite_usuarios.setValue(String(permission?.limite_usuarios) ?? '');
        this.limite_produtos.setValue(String(permission?.limite_produtos) ?? '');
        this.limite_clientes.setValue(String(permission?.limite_clientes) ?? '');
        this.date_expiration.setValue(permission?.date_expiration ?? '');
      }

      $('#modalPermission').modal('show');
    }).catch((error) => {
      $('#modalPermission').modal('show');
    })
  }

  savePermission() {
    let permission: Permission = {
      id_company: getCompanyId(),
      id_user: this.companySelected?.id,
      email: this.emailPermission.value ?? '',
      limite_clientes: Number(this.limite_clientes.value) ?? 0,
      limite_empresas: Number(this.limite_empresas.value) ?? 0,
      limite_nfce: Number(this.limite_nfce.value) ?? 0,
      limite_nfe: Number(this.limite_nfe.value) ?? 0,
      limite_produtos: Number(this.limite_produtos.value) ?? 0,
      limite_usuarios: Number(this.limite_usuarios.value) ?? 0,
      nome_empresa: this.nome_empresa.value ?? '',
      responsavel: this.responsavel.value ?? '',
      telefone: this.telefone.value?.replace(/[^\d]+/g, '') ?? '',
      valor_mensal: this.valor_mensal.value ? Number(this.valor_mensal.value.replace('R$', '').replace('.', '').replace(',', '.').trim()) : 0,
      date_expiration: this.date_expiration.value ?? ''
    }

    setPermision(permission);

    if (this.isEditModePermission) {
      this.apiService.updatePermission({
        id: this.companySelected?.permissions?.id,
        ...permission
      }).then((res) => {
        $('#modalPermission').modal('hide');
        this.isEditModePermission = false;
      })
    } else {
      this.apiService.createPermission(permission).then((res) => {
        $('#modalPermission').modal('hide');
        this.isEditModePermission = false;
      })
    }
  }

  formatValueCurrency(value: string | number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
  }

  changeValueFormat() {
    let value: any = this.valor_mensal.value;

    if (value) {
      value = value.replace(/[^0-9]/g, '')
      value = value.replace('.', '').replace(',', '.');
      value = Number(value) / 100;
      value = this.formatValueCurrency(value);
      this.valor_mensal.setValue(value);
    }
  }
}
