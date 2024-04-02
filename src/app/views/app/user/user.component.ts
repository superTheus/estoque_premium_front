import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Users } from './users.interface';
import { ApiService } from '../../../data/api.service';
import { getCompanyId } from '../../../utils/util';

import Swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  name = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  isEditMode = false;
  userSelected?: Users;
  data: Users[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.getUser({
      filter: {
        ativo: 'S',
        company: getCompanyId()
      }
    }).subscribe((res: any) => {
      console.log(res);
      this.data = res.results;
      console.log(this.data);
    })
  }

  save() {
    this.isEditMode ? this.updateUser() : this.createUser();

    $('#modalProduct').modal('hide');
  }

  createUser() {
    this.apiService.createUser({
      name: this.name.value + ' ' + this.lastName.value,
      email: this.email.value ?? '',
      password: this.password.value ?? '',
      photo: '',
      company: 1,
    }).then((res) => {
      console.log(res);
      this.load();
    });
  }

  updateUser() {
    this.apiService.updateUser({
      id: this.userSelected?.id,
      name: this.name.value + ' ' + this.lastName.value,
      email: this.email.value ?? '',
      password: this.password.value ?? '',
      photo: '',
      company: 1,
    }).then((res) => {
      console.log(res);
      this.load();
    });
  }

  update(user: Users) {
    this.userSelected = user;
    this.name.setValue(user.name?.split(' ')[0]);
    this.lastName.setValue(user.name?.split(' ')[1]);
    this.email.setValue(user.email);
    this.password.setValue(user.password);

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
          ativo: 'N'
        }).then((res) => {
          this.load();
          Swal.fire("Usuário deletado", "", "info");
        });
      }
    });
  }
}
