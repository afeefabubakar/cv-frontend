import { Component, effect, inject, signal } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog/dialog.components';
import { ProfileDataService } from '../../profile/services/profile-data.services';
import { EducationServices } from '../services/education.services';
import { Education } from '../../../shared/types/profile';
import { DatePipe, NgIf } from '@angular/common';
import { EducationFormComponent } from '../forms/education.forms';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-education',
  imports: [
    DialogComponent,
    NgIf,
    DatePipe,
    EducationFormComponent,
    SvgIconComponent,
  ],
  templateUrl: './education.views.html',
  styleUrl: './education.views.css',
})
export class EducationComponent {
  private profileDataService = inject(ProfileDataService);
  private educationService = inject(EducationServices);
  isOpen: boolean = false;
  selectedProfile: string = '';
  education = signal<Education[]>([]);
  selectedEducation = signal<Education | null>(null);
  isLocked = false;

  constructor() {
    effect(() => {
      this.isLocked = this.profileDataService.isLocked();
      this.selectedProfile = this.profileDataService.selectedProfile();
      const profile = this.profileDataService.profile();
      if (profile) {
        this.education.set(profile.educations);
      }
    });
  }

  openDialog(education?: Education) {
    this.isOpen = true;
    if (education) {
      this.selectedEducation.set(education);
    }
  }

  closeDialog() {
    this.isOpen = false;
    this.selectedEducation.set(null);
  }

  deleteEducation(id: string) {
    this.educationService.deleteEducation(id);
  }

  onSubmit(education: Education) {
    if (this.selectedEducation()) {
      this.educationService.updateEducation(
        this.selectedEducation()!.id,
        education
      );
    } else {
      this.educationService.createEducation(education);
    }
    this.closeDialog();
  }
}
