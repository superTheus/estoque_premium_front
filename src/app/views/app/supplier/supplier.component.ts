import { Component } from '@angular/core';
import { ApiService } from '../../../data/api.service';
import { Suppliers } from './supplier.interface';
import { FormControl, Validators } from '@angular/forms';

declare const $: any;

@Component({
  selector: 'app-box',
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SuppliersComponent {
  data: Suppliers[] = [];
  isEditMode: boolean = false;

  name = new FormControl('', [Validators.required]);
  document = new FormControl('', [Validators.required]);

  supplierSelected?: Suppliers;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findSuppliers({
      filter: {
        deleted: 'N'
      }
    }).then((res: any) => {
      console.log(res);
      this.data = res.results;
      console.log(this.data);
    })
  }

  save() {
    this.isEditMode ? this.updateSupplier() : this.createSupplier();

    $('#modalProduct').modal('hide');
  }

  createSupplier() {
    this.apiService.createSupplier({
      name: this.name.value ?? '',
      document: this.document.value ?? '',
      id_company: 1,
    }).then((res) => {
      console.log(res);
      this.load();
    });
  }

  updateSupplier() {
    this.apiService.updateSupplier({
      id: this.supplierSelected?.id,
      name: this.name.value ?? '',
      document: this.document.value ?? '',
      id_company: 1,
    }).then((res) => {
      console.log(res);
      this.load();
    });
  }

  update(supplier: Suppliers) {
    this.supplierSelected = supplier;
    this.name.setValue(supplier.name ?? '');
    this.document.setValue(supplier.document ?? '');

    this.isEditMode = true;
    $('#modalProduct').modal('show');
  }

  delete(supplier: Suppliers) {
    this.apiService.updateSupplier({
      id: supplier.id,
      deleted: 'S'
    }).then((res) => {
      console.log(res);
      this.load();
    });
  }
}
