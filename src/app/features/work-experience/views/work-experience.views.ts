import { Component, effect, inject, signal } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog/dialog.components';
import { WorkExperienceFormComponent } from '../forms/work-experience.forms';
import { WorkExperience } from '../../../shared/types/profile';
import { ProfileDataService } from '../../profile/services/profile-data.services';
import { NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-work-experience',
  imports: [
    DialogComponent,
    WorkExperienceFormComponent,
    NgIf,
    NgFor,
    DatePipe,
    SvgIconComponent,
  ],
  templateUrl: './work-experience.views.html',
  styleUrl: './work-experience.views.css',
})
export class WorkExperienceComponent {
  private profileDataService = inject(ProfileDataService);
  isOpen: boolean = false;
  workExperience = signal<WorkExperience[]>([]);
  selectedProfile: string = '';

  constructor() {
    effect(() => {
      this.selectedProfile = this.profileDataService.selectedProfile();
      const profile = this.profileDataService.profile();
      if (profile) {
        this.workExperience.set(profile.workExperiences);
      }
    });
  }

  onSubmit(formValue: WorkExperience) {
    const newFormValue = {
      ...formValue,
      startDate: new Date(formValue.startDate),
      endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
    };

    this.profileDataService.createWorkExperience(newFormValue);
    this.closeDialog();
  }

  deleteWorkExperience(id: string) {
    this.profileDataService.deleteWorkExperience(id);
  }

  openDialog() {
    this.isOpen = true;
  }

  closeDialog() {
    this.isOpen = false;
  }
}
