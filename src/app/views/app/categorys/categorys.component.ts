import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../../data/api.service';
import { Categorys } from './categorys.interface';
import Swal from 'sweetalert2';
import { AuthService } from '../../../shared/auth.service';
import { getCompanyId } from '../../../utils/util';
import { LoadService } from '../../../shared/load.service';

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

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private loaderService: LoadService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findCategorys({
      filter: {
        deleted: 'N',
        id_company: getCompanyId()
      }
    }).then(res => {
      this.data = res.results;
    })
  }

  save() {
    this.loaderService.show();
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
        this.loaderService.hide();
      })
    } else {
      this.apiService.createCategory({
        description: this.description.value ? this.description.value : '',
        id_company: 1,
      }).then(res => {
        this.data.push(res.results);
        this.loaderService.hide();
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
    Swal.fire({
      title: "Realmente deseja deletar esta categoria?",
      showDenyButton: true,
      confirmButtonText: "Sim Deletar",
      denyButtonText: `Não, cancelar`,
      confirmButtonColor: '#d33',
      denyButtonColor: '#3085d6',
    }).then((result) => {
      var newBrand = { ...brand };
      newBrand.deleted = 'S';
      this.Categoryselected = newBrand;

      this.apiService.updateCategory({
        id: this.Categoryselected?.id,
        description: this.description.value ? this.description.value : '',
        deleted: this.Categoryselected?.deleted
      }).then(res => {
        this.load();
        Swal.fire("Categoria deletada", "", "info");
      })
    });
  }
}
