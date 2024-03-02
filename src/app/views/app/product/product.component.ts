import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Products } from './product.interface';
import { ApiService } from '../../../data/api.service';

declare var $: any;

export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  description = new FormControl('');
  isEditMode = false;
  productSelected?: Products;
  data: Products[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findBrands({
      filter: {
        deleted: 'N'
      }
    }).then(res => {
      this.data = res.results;
    })
  }

  save() {
    if (this.isEditMode) {
      this.apiService.updateBrands({
        id: this.productSelected?.id,
        description: this.description.value ? this.description.value : '',
        deleted: this.productSelected?.deleted
      }).then(res => {
        let allProducts = [...this.data];
        let index = allProducts.findIndex(product => product.id === this.productSelected?.id);
        allProducts[index] = res.results;
        this.data = allProducts;
      })
    } else {
      this.apiService.createBrands({
        description: this.description.value ? this.description.value : ''
      }).then(res => {
        this.data.push(res.results);
      })
    }

    $('#modalProduct').modal('hide');
  }

  update(product: Products) {
    this.productSelected = product;
    this.description.setValue(product.description);
    this.isEditMode = true;
    $('#modalProduct').modal('show');
  }

  delete(product: Products) {
    var newProduct = { ...product };
    newProduct.deleted = 'S';
    this.productSelected = newProduct;

    this.apiService.updateBrands({
      id: this.productSelected?.id,
      description: this.description.value ? this.description.value : '',
      deleted: this.productSelected?.deleted
    }).then(res => {
      this.load();
    })
  }
}
