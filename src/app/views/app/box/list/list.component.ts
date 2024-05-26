import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Box } from '../box.interface';
import { ApiService } from '../../../../data/api.service';
import { AuthService } from '../../../../shared/auth.service';
import { getCompanyId, getUserId } from '../../../../utils/util';


declare const $: any;

@Component({
  selector: 'app-box',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
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

  close(box: Box) {
    this.boxSelected = box;
    $('#modalProduct').modal('show');
  }
}
