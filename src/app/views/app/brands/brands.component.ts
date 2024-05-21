import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../../data/api.service';
import { Brands } from './brands.interface';
import { getCompanyId } from '../../../utils/util';

import Swal from 'sweetalert2';
import { AuthService } from '../../../shared/auth.service';

declare const $: any;

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit {
  description = new FormControl('');
  isEditMode = false;
  brandSelected?: Brands;
  data: Brands[] = [];

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findBrands({
      filter: {
        deleted: 'N',
        id_company: getCompanyId()
      }
    }).then(res => {
      this.data = res.results;
    })
  }

  save() {
    if (this.isEditMode) {
      this.apiService.updateBrands({
        id: this.brandSelected?.id,
        description: this.description.value ? this.description.value : '',
        deleted: this.brandSelected?.deleted
      }).then(res => {
        let allBrands = [...this.data];
        let index = allBrands.findIndex(brand => brand.id === this.brandSelected?.id);
        allBrands[index] = res.results;
        this.data = allBrands;
      })
    } else {
      this.apiService.createBrands({
        description: this.description.value ? this.description.value : '',
        id_company: 1
      }).then(res => {
        this.data.push(res.results);
      })
    }

    $('#modalProduct').modal('hide');
  }

  update(brand: Brands) {
    this.brandSelected = brand;
    this.description.setValue(brand.description);
    this.isEditMode = true;
    $('#modalProduct').modal('show');
  }

  delete(brand: Brands) {
    Swal.fire({
      title: "Realmente deseja deletar esta marca?",
      showDenyButton: true,
      confirmButtonText: "Sim Deletar",
      denyButtonText: `Não, cancelar`,
      confirmButtonColor: '#d33',
      denyButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        var newBrand = { ...brand };
        newBrand.deleted = 'S';
        this.brandSelected = newBrand;

        this.apiService.updateBrands({
          id: this.brandSelected?.id,
          description: this.description.value ? this.description.value : '',
          deleted: this.brandSelected?.deleted
        }).then(res => {
          this.load();
          Swal.fire("Marca deletado", "", "info");
        })
      }
    });
  }
}
