import { Component } from '@angular/core';
import { LoadService } from '../../shared/load.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrl: './load.component.scss'
})
export class LoadComponent {
  constructor(
    public loadService: LoadService
  ) { }
}
