import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal } from '@angular/core';
import { Profile, ProfileListItem } from '../../../shared/types/profile';
import { QueryReturn } from '../../../shared/types';
import { API_URL } from '../../../shared/utils';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileDataService {
  listOfProfiles = signal<ProfileListItem[]>([]);

  constructor(private http: HttpClient) {
    this.http
      .get<QueryReturn<ProfileListItem[]>>(API_URL + '/profile')
      .subscribe((res) => {
        if (res.data) {
          this.listOfProfiles.set(res.data);
        }
      });
  }

  selectedProfile = signal('');

  profile = computed(() => {
    if (!this.selectedProfile()) return undefined;

    return this.http
      .get<QueryReturn<Profile>>(API_URL + `/profile/${this.selectedProfile()}`)
      .pipe(switchMap((res) => of(res.data)));
  });
}
