import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Permission, Users } from './users.interface';
import { ApiService } from '../../../data/api.service';
import { getCompanyId, getPermision, setPermision } from '../../../utils/util';

import Swal from 'sweetalert2';
import { Options } from '../../../components/select-default/select-default.interface';
import { AuthService } from '../../../shared/auth.service';
import { UtilsService } from '../../../shared/utils.service';
import { Company } from '../company/company.interface';

declare const $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  formPermission!: FormGroup;

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
  userSelected?: Users;
  data: Users[] = [];

  isEditModePermission = false;

  permissions = getPermision();
  disableNew = false;

  constructor(
    private apiService: ApiService,
    public utilsService: UtilsService,
    private formBuilder: FormBuilder,
  ) {
    this.formPermission = this.formBuilder.group({
      showMenuRegister: [true],
      managerUsers: [true],
      managerSuppliers: [true],
      managerClientes: [true],
      managerProdutos: [true],
      managerBrands: [true],
      managerCategories: [true],
      managerSubcategories: [true],
      showMenuBox: [true],
      managerBox: [true],
      showMenuSales: [true],
      managerSales: [true],
      showMenuReports: [true],
      showReportsSales: [true],
      showReportsStock: [true],
      showMenuStock: [true],
      managerEntries: [true],
      showMenuFinance: [true],
      managerFinance: [true],
      managerAccount: [true],
      issueNfe: [true],
    });

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
    this.apiService.getUser({
      filter: {
        ativo: 'S',
        company: getCompanyId()
      }
    }).subscribe(
      (res: any) => {
        this.data = res.results;
      },
      (error) => {
        this.data = [];
      }
    )
  }

  save() {
    this.isEditMode ? this.updateUser() : this.createUser();
    $('#modalUser').modal('hide');
  }

  uncheckAll() {
    Object.keys(this.formPermission.controls).forEach(key => {
      this.formPermission.controls[key].setValue(false);
    });
  }

  checkAll() {
    Object.keys(this.formPermission.controls).forEach(key => {
      this.formPermission.controls[key].setValue(true);
    });
  }

  resetAll() {
    if (this.userSelected?.permissao) {
      let permission: { [key: string]: any; } = this.userSelected.permissao
      delete permission['id'];
      delete permission['user'];
      this.formPermission.setValue(permission)
    }
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

  createUser() {
    this.apiService.createUser({
      name: this.name.value + ' ' + this.lastName.value,
      email: this.email.value ?? '',
      password: this.password.value ?? '',
      profile: this.profile.value as 'ADMIN' | 'STORE' ?? 'ADMIN',
      company: getCompanyId(),
      use_system: this.use_system ? 'Y' : 'N',
      type: 'simple'
    }).then((res) => {
      this.load();
    });
  }

  updateUser() {
    this.apiService.updateUser({
      id: this.userSelected?.id,
      name: this.name.value + ' ' + this.lastName.value,
      email: this.email.value ?? '',
      password: this.password.value ?? '',
      company: getCompanyId(),
      profile: this.profile.value as 'ADMIN' | 'STORE' ?? 'ADMIN',
      use_system: this.use_system ? 'Y' : 'N'
    }).then((res) => {
      this.load();
    });
  }

  update(user: Users) {
    this.userSelected = user;
    this.name.setValue(user.name?.split(' ')[0] ?? '');
    this.lastName.setValue(user.name?.split(' ')[1] ?? '');
    this.email.setValue(user.email ?? null);
    this.profile.setValue(user.profile ?? null);
    this.password.setValue(user.password ?? null);

    this.isEditMode = true;
    $('#modalUser').modal('show');
  }

  delete(user: Users) {
    Swal.fire({
      title: "Realmente deseja deletar este usuário?",
      showDenyButton: true,
      confirmButtonText: "Sim Deletar",
      denyButtonText: `Não, cancelar`,
      confirmButtonColor: '#d33',
      denyButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.updateUser({
          id: user?.id,
          ativo: 'N',
          use_system: this.use_system ? 'Y' : 'N',
          profile: this.profile.value as 'ADMIN' | 'STORE' ?? 'ADMIN',
          company: 1 // Add the missing 'company' property
        }).then((res) => {
          this.load();
          Swal.fire("Usuário deletado", "", "info");
        });
      }
    });
  }

  formatDocument() {
    if (this.document.value) {
      this.document.setValue(this.utilsService.formatDocument(this.document.value));
    }
  }

  formatCode() {
    if (this.code.value) {
      this.code.setValue(this.code.value.replace(/[^\d]+/g, ''));
    }

    this.load();
  }

  permission(user: Users) {
    this.userSelected = { ...user };

    console.log(this.userSelected)

    if (user.permissao) {
      let permission: { [key: string]: any; } = { ...user.permissao }
      delete permission['id'];
      delete permission['user'];
      this.formPermission.setValue(permission)
    }

    $('#modalPermission').modal('show');
  }

  savePermission() {
    let permissions: any = { ...this.userSelected?.permissao };
    if (permissions) {
      Object.keys(permissions).forEach((key: any) => {
        if (this.formPermission.controls[key]) {
          permissions[key] = this.formPermission.controls[key].value ? 1 : 0;
        }
      });
    }

    this.apiService.updateUserPermission(permissions).then((data) => {
      this.load();
      Swal.fire("Permissões alteradas", "", "info");
    })
  }

  formatValueCurrency(value: string | number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
  }
}
