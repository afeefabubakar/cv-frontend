import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Misc } from '../../../shared/types/profile';
import { ProfileDataService } from '../../profile/services/profile-data.services';

@Injectable({
  providedIn: 'root',
})
export class MiscService {
  private profileDataService = inject(ProfileDataService);
  misc = signal<Misc[]>([]);

  constructor(private http: HttpClient) {
    effect(() => {
      const profile = this.profileDataService.profile();
      if (profile) {
        this.misc.set(profile.misc);
      }
    });
  }

  addMisc(misc: Misc) {
    const url = new URL('api/misc', environment.apiUrl);
    url.searchParams.set(
      'profileId',
      this.profileDataService.selectedProfile()
    );

    this.http.post<Misc>(url.toString(), misc).subscribe((res) => {
      this.profileDataService.refetchProfile.set(true);
    });
  }

  deleteMisc(id: string) {
    this.http
      .delete<Misc>(environment.apiUrl + '/misc/' + id)
      .subscribe((res) => {
        this.profileDataService.refetchProfile.set(true);
      });
  }
}
