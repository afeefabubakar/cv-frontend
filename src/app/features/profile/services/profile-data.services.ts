import { HttpClient } from '@angular/common/http';
import { computed, Injectable, Signal, signal } from '@angular/core';
import { Profile, ProfileListItem } from '../../../shared/types/profile';
import { QueryReturn } from '../../../shared/types';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileDataService {
  listOfProfiles = signal<ProfileListItem[]>([]);

  constructor(private http: HttpClient) {
    this.http
      .get<QueryReturn<ProfileListItem[]>>(environment.apiUrl + '/profile')
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
      .get<QueryReturn<Profile>>(
        environment.apiUrl + `/profile/${this.selectedProfile()}`
      )
      .pipe(switchMap((res) => of(res.data)));
  });
}
