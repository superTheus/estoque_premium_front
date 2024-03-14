import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Form, FormControl, FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-input-default',
  templateUrl: './input-default.component.html',
  styleUrl: './input-default.component.scss'
})
export class InputDefaultComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() type: string = '';
  @Input() placeHolder: string = '';
  @Input() classname: string = '';
  @Input() control: FormControl;
  @Input() disabled: boolean = false;
  @Output() change = new EventEmitter();

  constructor() {
    this.control = new FormControl();
  }

  onChange = (event: any) => {
    this.change.emit(this.control.value);
  }
}
