import { Component } from '@angular/core';
import { ApiService } from '../../../data/api.service';
import { Clients } from './client.interface';
import { FormControl } from '@angular/forms';

declare const $: any;

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  name = new FormControl('');
  isEditMode = false;
  clientSelected: Clients | undefined;
  data: Clients[] = [];

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

    } else {

    }

    $('#modalProduct').modal('hide');
  }

  update(brand: Clients) {
    this.clientSelected = brand;
    this.isEditMode = true;
    $('#modalProduct').modal('show');
  }

  delete(client: Clients) {
    var newClient = { ...client };
    newClient.deleted = 'S';
    this.clientSelected = newClient;
  }
}
