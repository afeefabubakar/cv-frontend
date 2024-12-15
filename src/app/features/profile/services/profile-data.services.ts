import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal, effect } from '@angular/core';
import {
  Profile,
  ProfileListItem,
  WorkExperience,
} from '../../../shared/types/profile';
import { QueryReturn } from '../../../shared/types';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileDataService {
  listOfProfiles = signal<ProfileListItem[]>([]);
  selectedProfile = signal('');
  refetchProfile = signal(false);
  profileData = signal<Profile | undefined>(undefined);

  profile = computed(() => {
    if (this.refetchProfile()) {
      this.fetchProfileData();
    }
    return this.profileData();
  });

  constructor(private http: HttpClient) {
    this.http
      .get<QueryReturn<ProfileListItem[]>>(environment.apiUrl + '/profile')
      .subscribe((res) => {
        if (res.data) {
          this.listOfProfiles.set(res.data);
        }
      });

    effect(() => {
      const profileId = this.selectedProfile();
      if (profileId) {
        this.fetchProfileData();
      } else {
        this.profileData.set(undefined);
      }
    });
  }

  private fetchProfileData() {
    if (!this.selectedProfile()) {
      this.profileData.set(undefined);
      return;
    }

    this.getProfile(this.selectedProfile()).subscribe((profile) => {
      this.profileData.set(profile);
      this.refetchProfile.set(false);
    });
  }

  getProfile(profileId: string) {
    return this.http
      .get<QueryReturn<Profile>>(environment.apiUrl + `/profile/${profileId}`)
      .pipe(switchMap((res) => of(res.data)));
  }

  updateProfile(profile: Partial<Profile>) {
    this.http
      .put<QueryReturn<Profile>>(
        environment.apiUrl + `/profile/${this.selectedProfile()}`,
        profile
      )
      .subscribe((res) => {
        this.refetchProfile.set(true);
      });
  }
}
