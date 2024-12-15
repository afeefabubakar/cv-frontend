import { Component, inject, effect } from '@angular/core';
import { ProfileDataService } from '../../features/profile/services/profile-data.services';
import { Profile, ProfileListItem } from '../../shared/types/profile';
import { AngularSvgIconModule, SvgIconComponent } from 'angular-svg-icon';
import { NgIf } from '@angular/common';
import { ProfileFormComponent } from '../../features/profile/forms/profile.forms';
import { DialogComponent } from '../../shared/components/dialog/dialog.components';

@Component({
  selector: 'app-header',
  imports: [
    AngularSvgIconModule,
    NgIf,
    SvgIconComponent,
    ProfileFormComponent,
    DialogComponent,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class AppHeader {
  private profileDataService: ProfileDataService = inject(ProfileDataService);
  listOfProfiles: ProfileListItem[] = [];
  selectedProfile = '';
  fullName = 'Please select a profile';
  jobTitle = '';
  location = '';
  email = '';
  phone = '';
  isOpen = false;
  isLocked = false;

  constructor() {
    effect(() => {
      this.listOfProfiles = this.profileDataService.listOfProfiles();
      this.isLocked = this.profileDataService.isLocked();
      this.selectedProfile = this.profileDataService.selectedProfile();
      const profile = this.profileDataService.profile();

      if (profile) {
        this.fullName = `${profile.firstName} ${profile.lastName}`;
        this.jobTitle = profile.jobTitle;
        this.location =
          profile.location.state.name + ', ' + profile.location.country.name;
        this.email = profile.email;
        this.phone = profile.phone;
      } else {
        this.fullName = 'Please select a profile';
      }
    });
  }

  onProfileSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.profileDataService.selectedProfile.set(value);
  }

  onSubmit(profile: Profile) {
    this.profileDataService.updateProfile(profile);
    this.closeDialog();
  }

  toggleLock() {
    this.profileDataService.setProfileLock(!this.profileDataService.isLocked());
  }

  openDialog() {
    this.isOpen = true;
  }

  closeDialog() {
    this.isOpen = false;
  }
}
