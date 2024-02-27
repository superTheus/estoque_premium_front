import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../../data/api.service';
import { Categorys } from './categorys.interface';

declare const $: any;

@Component({
  selector: 'app-categorys',
  templateUrl: './categorys.component.html',
  styleUrl: './categorys.component.scss'
})
export class CategorysComponent implements OnInit {
  description = new FormControl('');
  isEditMode = false;
  Categoryselected?: Categorys;
  data: Categorys[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findCategorys({
      filter: {
        deleted: 'N'
      }
    }).then(res => {
      this.data = res.results;
    })
  }

  save() {
    if (this.isEditMode) {
      this.apiService.updateCategory({
        id: this.Categoryselected?.id,
        description: this.description.value ? this.description.value : '',
        deleted: this.Categoryselected?.deleted
      }).then(res => {
        let allCategorys = [...this.data];
        let index = allCategorys.findIndex(brand => brand.id === this.Categoryselected?.id);
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

  update(brand: Categorys) {
    this.Categoryselected = brand;
    this.description.setValue(brand.description);
    this.isEditMode = true;
    $('#modalProduct').modal('show');
  }

  delete(brand: Categorys) {
    var newBrand = { ...brand };
    newBrand.deleted = 'S';
    this.Categoryselected = newBrand;

    this.apiService.updateCategory({
      id: this.Categoryselected?.id,
      description: this.description.value ? this.description.value : '',
      deleted: this.Categoryselected?.deleted
    }).then(res => {
      this.load();
    })
  }
}
