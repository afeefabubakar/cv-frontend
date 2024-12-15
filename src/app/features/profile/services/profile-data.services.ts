import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal, effect } from '@angular/core';
import { Profile, ProfileListItem } from '../../../shared/types/profile';
import { QueryReturn } from '../../../shared/types';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileDataService {
  listOfProfilesData = signal<ProfileListItem[]>([]);
  refetchProfiles = signal(false);
  listOfProfiles = computed(() => {
    if (this.refetchProfiles()) {
      this.fetchProfiles();
    }
    return this.listOfProfilesData();
  });
  selectedProfile = signal('');
  refetchProfile = signal(false);
  profileData = signal<Profile | undefined>(undefined);
  isLocked = computed(() => {
    if (this.profileData()) {
      return this.profileData()?.locked ?? false;
    }
    return false;
  });

  profile = computed(() => {
    if (this.refetchProfile()) {
      this.fetchProfileData();
    }
    return this.profileData();
  });

  constructor(private http: HttpClient) {
    this.fetchProfiles();

    effect(() => {
      const profileId = this.selectedProfile();
      if (profileId) {
        this.fetchProfileData();
      } else {
        this.profileData.set(undefined);
      }
    });
  }

  private fetchProfiles() {
    this.getProfiles().subscribe((res) => {
      if (res) {
        this.listOfProfilesData.set(res);
      }
    });
  }

  private fetchProfileData() {
    this.getProfile(this.selectedProfile()).subscribe((profile) => {
      this.profileData.set(profile);
      this.refetchProfile.set(false);
    });
  }

  getProfiles() {
    return this.http
      .get<QueryReturn<ProfileListItem[]>>(environment.apiUrl + '/profile')
      .pipe(switchMap((res) => of(res.data)));
  }

  getProfile(profileId: string) {
    return this.http
      .get<QueryReturn<Profile>>(environment.apiUrl + `/profile/${profileId}`)
      .pipe(switchMap((res) => of(res.data)));
  }

  addProfile(profile: Partial<Profile>) {
    this.http
      .post<QueryReturn<Profile>>(environment.apiUrl + '/profile', profile)
      .subscribe((res) => {
        this.refetchProfile.set(true);
      });
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

  setProfileLock(lock: boolean) {
    this.http
      .get<QueryReturn<Profile>>(
        environment.apiUrl + `/profile/${this.selectedProfile()}/lock`
      )
      .subscribe((res) => {
        this.refetchProfile.set(true);
      });
  }
}
