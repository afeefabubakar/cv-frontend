import { Component, effect, inject, signal } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog/dialog.components';
import { ProfileDataService } from '../../profile/services/profile-data.services';
import { EducationServices } from '../services/education.services';
import { Education } from '../../../shared/types/profile';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-education',
  imports: [DialogComponent, NgIf, DatePipe],
  templateUrl: './education.views.html',
  styleUrl: './education.views.css',
})
export class EducationComponent {
  private profileDataService = inject(ProfileDataService);
  private educationService = inject(EducationServices);
  isOpen: boolean = false;
  selectedProfile: string = '';
  education = signal<Education[]>([]);

  constructor() {
    effect(() => {
      this.selectedProfile = this.profileDataService.selectedProfile();
      const profile = this.profileDataService.profile();
      if (profile) {
        this.education.set(profile.educations);
      }
    });
  }

  openDialog() {
    this.isOpen = true;
  }

  closeDialog() {
    this.isOpen = false;
  }
}
