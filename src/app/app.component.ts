import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './core/header/header.component';
import { ProfileSummaryComponent } from './features/profile/views/profile-summary.views';
import { WorkExperienceComponent } from './features/work-experience/views/work-experience.views';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AppHeader,
    ProfileSummaryComponent,
    WorkExperienceComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cv-frontend';
}
