import { Component, effect, inject } from '@angular/core';
import { ProfileDataService } from '../services/profile-data.services';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile-summary',
  imports: [NgIf],
  templateUrl: './profile-summary.views.html',
  styleUrls: ['./profile-summary.views.css'],
})
export class ProfileSummaryComponent {
  private profileDataService: ProfileDataService = inject(ProfileDataService);
  profileSummary: string = '';

  constructor() {
    effect(() => {
      const profile = this.profileDataService.profile();
      profile?.subscribe((profile) => {
        if (profile) {
          this.profileSummary = profile.summary;
        }
      });
    });
  }
}
