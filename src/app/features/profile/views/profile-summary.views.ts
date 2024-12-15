import { Component, effect, inject } from '@angular/core';
import { ProfileDataService } from '../services/profile-data.services';
import { NgIf } from '@angular/common';
import { Profile } from '../../../shared/types/profile';

@Component({
  selector: 'app-profile-summary',
  imports: [NgIf],
  templateUrl: './profile-summary.views.html',
  styleUrls: ['./profile-summary.views.css'],
})
export class ProfileSummaryComponent {
  private profileDataService: ProfileDataService = inject(ProfileDataService);
  profile: Profile | undefined = undefined;

  constructor() {
    effect(() => {
      this.profile = this.profileDataService.profile();
    });
  }
}
