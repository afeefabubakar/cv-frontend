import { AppHeader } from './core/header/header.component';
import { Component } from '@angular/core';
import { EducationComponent } from './features/education/views/education.views';
import { ProfileSkillViews } from './features/skill/views/profile-skill.views';
import { ProfileSummaryComponent } from './features/profile/views/profile-summary.views';
import { RouterOutlet } from '@angular/router';
import { WorkExperienceComponent } from './features/work-experience/views/work-experience.views';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AppHeader,
    ProfileSummaryComponent,
    WorkExperienceComponent,
    EducationComponent,
    ProfileSkillViews,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'cv-frontend';
}
