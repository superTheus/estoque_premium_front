import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Products } from './product.interface';
import { ApiService } from '../../../data/api.service';
import { Options } from '../../../components/select-default/select-default.interface';
import { Brands } from '../brands/brands.interface';
import { Categorys } from '../categorys/categorys.interface';
import { Subcategorys } from '../subcategorys/subcategorys.interface';
import { Suppliers } from '../supplier/supplier.interface';
import { getCompanyId } from '../../../utils/util';

declare var $: any;


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
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

  isEditMode = false;
  productSelected?: Products;
  data: Products[] = [];

  brandsSelect: Options[] = []
  categorySelect: Options[] = []
  subcategorySelect: Options[] = []
  supplierSelect: Options[] = []
  controlStock = [
    { label: 'Sim', value: 'S' },
    { label: 'Não', value: 'N' }
  ]

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  async load() {
    const [brands, category, subcategory, supplier, products] = await Promise.all([
      this.apiService.findBrands({
        filter: {
          deleted: 'N',
          id_company: getCompanyId()
        }
      }),
      this.apiService.findCategorys({
        filter: {
          deleted: 'N',
          id_company: getCompanyId()
        }
      }),
      this.apiService.findSubcategorys({
        filter: {
          deleted: 'N',
          id_company: getCompanyId()
        }
      }),
      this.apiService.findSuppliers({
        filter: {
          deleted: 'N',
          id_company: getCompanyId()
        }
      }),
      this.apiService.findProducts({
        filter: {
          deleted: 'N',
          id_company: getCompanyId()
        }
      }),
    ]);

    this.brandsSelect = brands.results.map((brand: Brands): Options => { return { label: brand.description, value: brand.id || 0 } })
    this.categorySelect = category.results.map((category: Categorys): Options => { return { label: category.description, value: category.id || 0 } })
    this.subcategorySelect = subcategory.results.map((subcategorys: Subcategorys): Options => { return { label: subcategorys.description, value: subcategorys.id || 0 } })
    this.supplierSelect = supplier.results.map((supplier: Suppliers): Options => { return { label: supplier.name || '', value: supplier.id || 0 } })

    this.data = products.results;
  }

  save() {
    if (this.isEditMode) {
      this.apiService.updateProduct({
        id: this.productSelected?.id,
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
        id_company: 1,
        deleted: this.productSelected?.deleted
      }).then(res => {
        let allProducts = [...this.data];
        let index = allProducts.findIndex(product => product.id === this.productSelected?.id);
        allProducts[index] = res.results;
        this.data = allProducts;
      })
    } else {
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
      }).then(res => {
        this.data.push(res.results);
      })
    }

    $('#modalProduct').modal('hide');
  }

  update(product: Products) {
    this.productSelected = product;
    this.description.setValue(product.description ? product.description : '');
    this.id_brand.setValue(product.id_brand ? String(product.id_brand) : '');
    this.id_category.setValue(product.id_category ? String(product.id_category) : '');
    this.id_subcategory.setValue(product.id_subcategory ? String(product.id_subcategory) : '');
    this.price_sale.setValue(product.price_sale ? String(product.price_sale) : '');
    this.price_cost.setValue(product.price_cost ? String(product.price_cost) : '');
    this.ncm.setValue(product.ncm ? product.ncm : '');
    this.id_supplier.setValue(product.id_fornecedor ? String(product.id_fornecedor) : '');
    this.control_stock.setValue(product.control_stock ? product.control_stock : 'S');
    this.stock.setValue(product.stock ? String(product.stock) : '');
    this.isEditMode = true;
    $('#modalProduct').modal('show');
  }

  delete(product: Products) {
    var newProduct = { ...product };
    newProduct.deleted = 'S';
    this.productSelected = newProduct;

    this.apiService.updateProduct(newProduct).then(res => {
      this.load();
    })
  }
}
