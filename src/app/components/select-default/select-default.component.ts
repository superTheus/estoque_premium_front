import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Options } from './select-default.interface';

@Component({
  selector: 'app-select-default',
  templateUrl: './select-default.component.html',
  styleUrl: './select-default.component.scss'
})
export class SelectDefaultComponent {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() className?: string = '';
  @Input() control: FormControl;
  @Input() items: Options[] = [];
  @Input() showButton = false;

  @Output() change = new EventEmitter();
  @Output() buttonAction = new EventEmitter();

  constructor() {
    this.control = new FormControl();
  }

  onChange() {
    this.change.emit();
  }

  onButtonAction() {
    this.buttonAction.emit();
  }
}
