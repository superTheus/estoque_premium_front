import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Users } from './users.interface';
import { ApiService } from '../../../data/api.service';

declare const $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  description = new FormControl('');
  isEditMode = false;
  userSelected?: Users;
  data: Users[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.getUser({
      filters: {
        deleted: 'N'
      }
    }).subscribe((res: any) => {
      console.log(res);
      this.data = res.results;
      console.log(this.data);
    })
  }

  save() {
    if (this.isEditMode) {
      this.apiService.updateCategory({
        id: this.userSelected?.id,
        description: this.description.value ? this.description.value : '',
        deleted: this.userSelected?.deleted
      }).then(res => {
        let allCategorys = [...this.data];
        let index = allCategorys.findIndex(brand => brand.id === this.userSelected?.id);
        allCategorys[index] = res.results;
        this.data = allCategorys;
      })
    } else {
      this.apiService.createCategory({
        description: this.description.value ? this.description.value : ''
      }).then(res => {
        this.data.push(res.results);
      })
    }

    $('#modalProduct').modal('hide');
  }

  update(brand: Users) {
    this.userSelected = brand;
    // this.description.setValue(brand.description);
    this.isEditMode = true;
    $('#modalProduct').modal('show');
  }

  delete(user: Users) {
    var newUser = { ...user };
    newUser.deleted = 'S';
    this.userSelected = newUser;

    this.apiService.updateCategory({
      id: this.userSelected?.id,
      description: this.description.value ? this.description.value : '',
      deleted: this.userSelected?.deleted
    }).then(res => {
      this.load();
    })
  }
}
