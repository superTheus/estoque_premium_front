import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-quantity',
  templateUrl: './input-quantity.component.html',
  styleUrl: './input-quantity.component.scss'
})
export class InputQuantityComponent {
  @Input() id: string = '';
  @Input() control!: FormControl;
  @Input() label!: string;
  @Output() change = new EventEmitter<number>();;

  minus() {
    if (Number(this.control.value) > 1)
      this.control.setValue(Number(this.control.value) - 1);

    this.change.emit(this.control.value);
  }

  plus() {
    this.control.setValue(Number(this.control.value) + 1);

    this.change.emit(this.control.value);
  }
}
