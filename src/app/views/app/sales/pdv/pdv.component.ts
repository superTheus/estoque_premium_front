import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as bootstrap from 'bootstrap';

import { Options } from '../../../../components/select-default/select-default.interface';
import { ApiService } from '../../../../data/api.service';
import { Brands } from '../../brands/brands.interface';
import { Categorys } from '../../categorys/categorys.interface';
import { Subcategorys } from '../../subcategorys/subcategorys.interface';
import { Suppliers } from '../../supplier/supplier.interface';
import { Products } from '../../product/product.interface';
import { SalesService } from '../../../../data/sales.service';
import { SaleProduct } from '../sales.interface';

declare var $: any;

@Component({
  selector: 'app-pdv',
  templateUrl: './pdv.component.html',
  styleUrl: './pdv.component.scss'
})
export class PdvComponent {

  search = new FormControl('');

  description = new FormControl('');
  price_sale = new FormControl('');
  price_cost = new FormControl('');
  ncm = new FormControl('');
  control_stock = new FormControl('S');
  stock = new FormControl('');
  id_company = new FormControl('');
  id_brand = new FormControl('');
  id_category = new FormControl('');
  id_subcategory = new FormControl('');
  id_supplier = new FormControl('');

  brandsSelect: Options[] = []
  categorySelect: Options[] = []
  subcategorySelect: Options[] = []
  supplierSelect: Options[] = []
  controlStock = [
    { label: 'Sim', value: 'S' },
    { label: 'Não', value: 'N' }
  ]

  products: Products[] = [];

  constructor(
    private apiService: ApiService,
    private salesService: SalesService
  ) { }

  ngOnInit(): void {
    this.load();
  }

  loadProducts(event: KeyboardEvent) {
    if (event.key.toLocaleUpperCase() === 'ENTER') {
      this.apiService.findProducts({
        filter: {
          deleted: "N"
        },
        search: this.search.value || ''
      }).then(response => {
        this.products = response.results;
        this.openModal();
      });
    };
  }

  openModal = () => {
    const element = document.getElementById('modalListProduct');

    if (element) {
      var myModal = new bootstrap.Modal(element, {});
      myModal.show();
    }
  }

  async load() {
    const [brands, category, subcategory, supplier] = await Promise.all([
      this.apiService.findBrands({
        filter: {
          deleted: 'N'
        }
      }),
      this.apiService.findCategorys({
        filter: {
          deleted: 'N'
        }
      }),
      this.apiService.findSubcategorys({
        filter: {
          deleted: 'N'
        }
      }),
      this.apiService.findSuppliers({
        filter: {
          deleted: 'N'
        }
      })
    ]);

    this.brandsSelect = brands.results.map((brand: Brands): Options => { return { label: brand.description, value: brand.id || 0 } })
    this.categorySelect = category.results.map((category: Categorys): Options => { return { label: category.description, value: category.id || 0 } })
    this.subcategorySelect = subcategory.results.map((subcategorys: Subcategorys): Options => { return { label: subcategorys.description, value: subcategorys.id || 0 } })
    this.supplierSelect = supplier.results.map((supplier: Suppliers): Options => { return { label: supplier.name || '', value: supplier.id || 0 } })
  }

  save() {
    this.apiService.createProduct({
      description: this.description.value ? this.description.value : '',
      id_brand: Number(this.id_brand.value) || 0,
      id_category: Number(this.id_category.value) || 0,
      id_subcategory: Number(this.id_subcategory.value) || 0,
      price_sale: Number(this.price_sale.value) || 0,
      price_cost: Number(this.price_cost.value) || 0,
      ncm: this.ncm.value ? this.ncm.value : '',
      id_fornecedor: Number(this.id_supplier.value) || 0,
      control_stock: this.control_stock.value || 'S',
      stock: Number(this.stock.value) || 0,
      id_company: 1
    });

    $('#modalProduct').modal('hide');
  }

  createSale(callback?: () => void) {
    this.salesService.createSale({
      id_company: 1,
      id_user: 1,
      total: 0
    }).then(response => {
      console.log(response);
      if (callback) {
        callback();
      }
    });
  }

  addProduct(product: Products): void {
    this.salesService.addProduct({
      id: 0,
      id_product: product.id || 0,
      id_sale: this.salesService.currentSale.id || 0,
      quantity: 1,
      desconto: 0,
      desconto_percentual: 0,
      total: product.price_sale || 0
    }).then(response => {
      console.log(response);
    });
  }

  verifySale(product: Products) {
    if (this.salesService.currentSale) {
      this.addProduct(product)
    } else {
      this.createSale(() => this.addProduct(product));
    }
  }
}
