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
  private miscData = signal<Misc[]>([]);
  private refetchMisc = signal<boolean>(false);
  misc = computed(() => {
    if (this.refetchMisc()) {
      this.fetchMisc();
    }
    return this.miscData();
  });

  constructor(private http: HttpClient) {
    effect(() => {
      if (this.profileDataService.selectedProfile()) {
        this.fetchMisc();
      }
    });
  }

  private fetchMisc() {
    this.getMisc().subscribe((res) => {
      if (res) {
        this.miscData.set(res);
      }
    });
    this.refetchMisc.set(false);
  }

  getMisc() {
    return this.http.get<Misc[]>(environment.apiUrl + '/misc');
  }

  addMisc(misc: Misc) {
    this.http
      .post<Misc>(environment.apiUrl + '/misc', misc)
      .subscribe((res) => {
        this.profileDataService.refetchProfile.set(true);
        this.refetchMisc.set(true);
      });
  }

  deleteMisc(id: string) {
    this.http
      .delete<Misc>(environment.apiUrl + '/misc/' + id)
      .subscribe((res) => {
        this.profileDataService.refetchProfile.set(true);
        this.refetchMisc.set(true);
      });
  }
}
