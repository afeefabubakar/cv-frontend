import { Component, effect, inject } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog/dialog.components';
import { WorkExperienceFormComponent } from '../forms/work-experience.forms';
import { WorkExperience } from '../../../shared/types/profile';
import { ProfileDataService } from '../../profile/services/profile-data.services';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-work-experience',
  imports: [DialogComponent, WorkExperienceFormComponent, NgIf, FormsModule],
  templateUrl: './work-experience.views.html',
  styleUrl: './work-experience.views.css',
})
export class WorkExperienceComponent {
  private profileDataService = inject(ProfileDataService);
  isOpen: boolean = false;
  workExperience: WorkExperience[] = [];
  selectedProfile: string = '';

  constructor() {
    effect(() => {
      this.selectedProfile = this.profileDataService.selectedProfile();
      const profile = this.profileDataService.profile();
      if (profile) {
        profile.subscribe((profile) => {
          this.workExperience = profile.workExperience;
        });
      }
    });
  }

  onSubmit(formValue: WorkExperience) {
    console.log(formValue);
  }

  openDialog() {
    this.isOpen = true;
  }

  closeDialog() {
    this.isOpen = false;
  }
}
