import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class LoadService {
  show() {
    $('#loaderModal').modal('show');
  }

  hide() {
    $('#loaderModal').modal('hide');
  }
}
