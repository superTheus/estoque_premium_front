import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-default',
  templateUrl: './button-default.component.html',
  styleUrl: './button-default.component.scss'
})
export class ButtonDefaultComponent {
  @Input() text: string = '';
  @Input() classname: string = '';
  @Output() clickAction = new EventEmitter();

  click() {
    this.clickAction.emit();
  }
}
