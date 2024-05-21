import { Component } from '@angular/core';
import { Brands } from '../brands/brands.interface';
import { ApiService } from '../../../data/api.service';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../../shared/auth.service';
import { Box } from './box.interface';
import { UtilsService } from '../../../shared/utils.service';
import { getCompanyId, getUserId } from '../../../utils/util';

declare const $: any;

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrl: './box.component.scss'
})
export class BoxComponent {
  value = new FormControl('0');
  isEditMode = false;
  boxSelected?: Box;
  data: Box[] = [];

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.apiService.findBox({
      filter: {
        id_company: getCompanyId(),
        id_user: getUserId()
      }
    }).then(res => {
      this.data = res.results;
    })
  }

  save() {
    let newBox = { ...this.boxSelected }
    newBox.value_final = Number(this.value.value);
    newBox.status = 'FE';
    this.apiService.updateBox(newBox).then(res => {
      this.load();
      $('#modalProduct').modal('hide');
    })
  }

  close(box: Box) {
    this.boxSelected = box;
    $('#modalProduct').modal('show');
  }
}
