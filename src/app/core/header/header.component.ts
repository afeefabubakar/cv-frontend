import { Component } from '@angular/core';
import { InputSwitchComponent } from '../../shared/input-switch/input-switch.component';

@Component({
  selector: 'app-header',
  imports: [InputSwitchComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class AppHeader {
  title: string = 'Afeef bin Abu Bakar';
}
