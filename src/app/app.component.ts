import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './core/header/header.component';
import { ProfileSummaryComponent } from './features/profile/views/profile-summary.views';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeader, ProfileSummaryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cv-frontend';
}
