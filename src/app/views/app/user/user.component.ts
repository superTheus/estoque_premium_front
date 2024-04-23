import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Users } from './users.interface';
import { ApiService } from '../../../data/api.service';
import { getCompanyId } from '../../../utils/util';

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
  isAdmin = false;
  userSelected?: Users;
  data: Users[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    public utilsService: UtilsService
  ) {
    this.isAdmin = this.authService.user.companyData.type === 1 && this.authService.user.profile === 'ADMIN';
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    if (this.isAdmin) {
      let filter: Users = {
        ativo: 'S'
      }

      if (Number(this.code.value)) {
        filter.id = Number(this.code.value);
      }

      this.apiService.getUser({
        filter: filter
      }).subscribe(
        (res: any) => {
          this.data = res.results;
        },
        (error) => {
          this.data = [];
        }
      )
    } else {
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
  }

  save() {
    this.isEditMode ? this.updateUser() : this.createUser();
    $('#modalProduct').modal('hide');
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
    $('#modalProduct').modal('show');
  }

  createUser() {
    if (this.isAdmin) {
      this.apiService.createCompany({
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
          use_system: 'Y'
        }).then((res) => {
          this.apiService.createLastPass({
            id_user: res.results.id,
            last_pass: pass
          }).then((res) => {
            this.load();
          });
        });
      });
    } else {
      this.apiService.createUser({
        name: this.name.value + ' ' + this.lastName.value,
        email: this.email.value ?? '',
        password: this.password.value ?? '',
        profile: this.profile.value as 'ADMIN' | 'STORE' ?? 'ADMIN',
        company: 1,
        use_system: this.use_system ? 'Y' : 'N'
      }).then((res) => {
        this.load();
      });
    }
  }

  updateUser() {
    if (this.isAdmin) {
      let company = this.userSelected?.companyData as Company;
      let user = this.userSelected as Users;
      company.cnpj = this.document.value?.replace(/[^\d]+/g, '') as string;
      company.telefone = this.telephone.value?.replace(/[^\d]+/g, '') as string;
      company.email = this.email.value ?? '';

      user.name = this.name.value + ' ' + this.lastName.value;
      user.email = this.email.value ?? '';

      Promise.all([this.apiService.updateCompany(company), this.apiService.updateUser(user)]).then((res) => {
        this.load();
      })
    } else {
      this.apiService.updateUser({
        id: this.userSelected?.id,
        name: this.name.value + ' ' + this.lastName.value,
        email: this.email.value ?? '',
        password: this.password.value ?? '',
        company: 1,
        profile: this.profile.value as 'ADMIN' | 'STORE' ?? 'ADMIN',
        use_system: this.use_system ? 'Y' : 'N'
      }).then((res) => {
        this.load();
      });
    }
  }

  update(user: Users) {
    this.userSelected = user;
    this.name.setValue(user.name?.split(' ')[0] ?? '');
    this.lastName.setValue(user.name?.split(' ')[1] ?? '');
    this.email.setValue(user.email ?? null);

    if (this.isAdmin) {
      this.document.setValue(this.utilsService.formatDocument(user.companyData?.cnpj));
      this.telephone.setValue(this.utilsService.formatPhoneNumber(user.companyData?.telefone));
      this.password.setValue(user.lastpassword?.last_pass ?? null);
    } else {
      this.password.setValue(user.password ?? null);
    }

    this.isEditMode = true;
    $('#modalProduct').modal('show');
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

  formatTelefone() {
    if (this.telephone.value) {
      this.telephone.setValue(this.utilsService.formatPhoneNumber(this.telephone.value));
    }
  }

  formatCode() {
    if (this.code.value) {
      this.code.setValue(this.code.value.replace(/[^\d]+/g, ''));
    }

    this.load();
  }

  generatePassword() {
    let pass = this.utilsService.generatePassword(String(this.userSelected?.id));

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
}
