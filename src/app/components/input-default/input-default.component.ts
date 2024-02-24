import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-default',
  standalone: true,
  imports: [],
  templateUrl: './input-default.component.html',
  styleUrl: './input-default.component.scss'
})
export class InputDefaultComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() type: string = '';
  @Input() placeHolder: string = '';
}
