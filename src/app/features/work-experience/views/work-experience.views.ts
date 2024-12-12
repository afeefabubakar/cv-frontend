import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog/dialog.components';
import { WorkExperienceFormComponent } from '../forms/work-experience.forms';
import { WorkExperience } from '../../../shared/types/profile';
import { ProfileDataService } from '../../profile/services/profile-data.services';
import { NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { WorkExperienceService } from '../services/work-experience.services';

@Component({
  selector: 'app-work-experience',
  imports: [
    DialogComponent,
    WorkExperienceFormComponent,
    NgIf,
    DatePipe,
    SvgIconComponent,
  ],
  templateUrl: './work-experience.views.html',
  styleUrl: './work-experience.views.css',
})
export class WorkExperienceComponent {
  private profileDataService = inject(ProfileDataService);
  private workExperienceService = inject(WorkExperienceService);
  isOpen: boolean = false;
  workExperience = signal<WorkExperience[]>([]);
  selectedProfile: string = '';
  selectedWorkExperience = signal<WorkExperience | null>(null);

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
      isCurrent: Boolean(formValue.isCurrent),
      startDate: new Date(formValue.startDate),
      endDate: formValue.endDate ? new Date(formValue.endDate) : undefined,
    };

    if (this.selectedWorkExperience()) {
      this.workExperienceService.updateWorkExperience(
        this.selectedWorkExperience()!.id,
        newFormValue
      );
    } else {
      this.workExperienceService.createWorkExperience(newFormValue);
    }
    this.closeDialog();
  }

  deleteWorkExperience(id: string) {
    this.workExperienceService.deleteWorkExperience(id);
  }

  openDialog(workExperience: WorkExperience | null = null) {
    this.isOpen = true;
    this.selectedWorkExperience.set(workExperience);
  }

  closeDialog() {
    this.isOpen = false;
    this.selectedWorkExperience.set(null);
  }
}
