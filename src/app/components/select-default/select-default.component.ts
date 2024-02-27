import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-default',
  templateUrl: './select-default.component.html',
  styleUrl: './select-default.component.scss'
})
export class SelectDefaultComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control: FormControl;
  @Input() items: {
    value: string;
    label: string;
  }[] = [];

  constructor() {
    this.control = new FormControl();
  }
}
