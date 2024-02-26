import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

declare const $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  description = new FormControl('');
  isEditMode = false;

  data = [];

  load() { }

  save() {
    $('#modalProduct').modal('hide');
  }
}
