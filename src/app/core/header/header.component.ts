import { Component, inject, effect } from '@angular/core';
import { ProfileDataService } from '../../features/profile/services/profile-data.services';
import { ProfileListItem } from '../../shared/types/profile';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [AngularSvgIconModule, NgIf],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class AppHeader {
  profileDataService: ProfileDataService = inject(ProfileDataService);
  listOfProfiles: ProfileListItem[] = [];
  selectedProfile = '';
  fullName = 'Please select a profile';
  jobTitle = '';
  location = '';
  email = '';
  phone = '';

  constructor() {
    effect(() => {
      this.listOfProfiles = this.profileDataService.listOfProfiles();
    });

    effect(() => {
      this.selectedProfile = this.profileDataService.selectedProfile();
      const profile = this.profileDataService.profile();

      if (profile) {
        profile.subscribe((profileData) => {
          if (profileData && this.selectedProfile) {
            this.fullName = `${profileData.firstName} ${profileData.lastName}`;
            this.jobTitle = profileData.jobTitle;
            this.location =
              profileData.location.state.name +
              ', ' +
              profileData.location.country.name;
            this.email = profileData.email;
            this.phone = profileData.phone;
          } else {
            this.fullName = 'Please select a profile';
          }
        });
      }
    });
  }

  onProfileSelect(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.profileDataService.selectedProfile.set(value);
  }
}
