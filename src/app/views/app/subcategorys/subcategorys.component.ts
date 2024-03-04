import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../../data/api.service';
import { Subcategorys } from './subcategorys.interface';
import { Categorys } from '../categorys/categorys.interface';

declare const $: any;

@Component({
  selector: 'app-categorys',
  templateUrl: './subcategorys.component.html',
  styleUrl: './subcategorys.component.scss'
})
export class SubcategorysComponent implements OnInit {
  description = new FormControl('');
  category = new FormControl('');
  isEditMode = false;
  Subcategoryselected?: Subcategorys;
  data: Subcategorys[] = [];
  categories: {
    value: string;
    label: string;
  }[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findSubcategorys({
      filter: {
        deleted: 'N'
      }
    }).then(res => {
      this.data = res.results;
    })

    this.apiService.findCategorys({
      filter: {
        deleted: 'N'
      }
    }).then(res => {
      this.categories = res.results.map((category: Categorys) => {
        return {
          value: category.id,
          label: category.description
        }
      });
    })
  }

  save() {
    if (this.isEditMode) {
      this.apiService.updateSubcategory({
        id: this.Subcategoryselected?.id ? this.Subcategoryselected?.id : 0,
        description: this.description.value ? this.description.value : '',
        id_category: this.category.value ? Number(this.category.value) : 0,
        deleted: this.Subcategoryselected?.deleted ? this.Subcategoryselected?.deleted : 'N'
      }).then(res => {
        let allSubcategorys = [...this.data];
        let index = allSubcategorys.findIndex(subcategory => subcategory.id === this.Subcategoryselected?.id);
        allSubcategorys[index] = res.results;
        this.data = allSubcategorys;

        this.description.setValue('');
        this.category.setValue('');
      })
    } else {
      this.apiService.createSubcategory({
        description: this.description.value ? this.description.value : '',
        id_category: this.category.value ? Number(this.category.value) : 0,
        id_company: 1,
      }).then(res => {
        this.data.push(res.results);
        this.description.setValue('');
        this.category.setValue('');
      })
    }

    $('#modalProduct').modal('hide');
  }

  update(subcategory: Subcategorys) {
    this.Subcategoryselected = subcategory;
    this.description.setValue(subcategory.description);
    this.category.setValue(String(subcategory.id_category));
    this.isEditMode = true;
    $('#modalProduct').modal('show');
  }

  delete(subcategory: Subcategorys) {
    var newsubcategory = { ...subcategory };
    newsubcategory.deleted = 'S';
    this.Subcategoryselected = newsubcategory;

    this.apiService.updateSubcategory({
      id: this.Subcategoryselected?.id,
      description: this.Subcategoryselected.id ? this.Subcategoryselected.description : '',
      id_category: this.Subcategoryselected.id_category ? Number(this.Subcategoryselected.id_category) : 0,
      deleted: this.Subcategoryselected?.deleted
    }).then(res => {
      this.load();
    })
  }
}
