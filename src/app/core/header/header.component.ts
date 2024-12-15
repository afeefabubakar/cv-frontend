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
  profile: Profile | undefined = undefined;
  isOpen = false;
  isLocked = false;

  constructor() {
    effect(() => {
      this.listOfProfiles = this.profileDataService.listOfProfiles();
      this.isLocked = this.profileDataService.isLocked();
      this.selectedProfile = this.profileDataService.selectedProfile();
      this.profile = this.profileDataService.profile();
    });
  }

  addProfile() {
    this.profileDataService.selectedProfile.set('');
    this.profileDataService.profileData.set(undefined);
    this.openDialog();
  }

  onProfileSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.profileDataService.selectedProfile.set(value);
  }

  onSubmit(profile: Profile) {
    if (this.selectedProfile) {
      this.profileDataService.updateProfile(profile);
    } else {
      this.profileDataService.addProfile(profile);
    }
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
