import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProfileDataService } from '../../profile/services/profile-data.services';
import { Education } from '../../../shared/types/profile';
import { QueryReturn } from '../../../shared/types';
@Injectable({ providedIn: 'root' })
export class EducationServices {
  constructor(
    private http: HttpClient,
    private profileDataService: ProfileDataService
  ) {}

  createEducation(education: Education) {
    const url = new URL('api/education', environment.apiUrl);
    url.searchParams.set(
      'profileId',
      this.profileDataService.selectedProfile()
    );

    this.http
      .post<QueryReturn<Education>>(url.toString(), education)
      .subscribe((res) => {
        this.profileDataService.refetchProfile.set(true);
      });
  }

  updateEducation(id: string, education: Education) {
    const url = new URL(`api/education/${id}`, environment.apiUrl);
    this.http
      .put<QueryReturn<Education>>(url.toString(), education)
      .subscribe((res) => {
        this.profileDataService.refetchProfile.set(true);
      });
  }

  deleteEducation(id: string) {
    const url = new URL(`api/education/${id}`, environment.apiUrl);

    this.http
      .delete<QueryReturn<Education>>(url.toString())
      .subscribe((res) => {
        this.profileDataService.refetchProfile.set(true);
      });
  }
}
