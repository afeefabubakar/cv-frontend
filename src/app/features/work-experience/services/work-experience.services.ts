import { Injectable } from '@angular/core';
import { ProfileDataService } from '../../profile/services/profile-data.services';
import { environment } from '../../../../environments/environment';
import { QueryReturn } from '../../../shared/types';
import { HttpClient } from '@angular/common/http';
import { WorkExperience } from '../../../shared/types/profile';

@Injectable({ providedIn: 'root' })
export class WorkExperienceService {
  constructor(
    private http: HttpClient,
    private profileDataService: ProfileDataService
  ) {}

  createWorkExperience(workExperience: WorkExperience) {
    const url = new URL('api/work-experience', environment.apiUrl);
    url.searchParams.set(
      'profileId',
      this.profileDataService.selectedProfile()
    );

    this.http
      .post<QueryReturn<WorkExperience>>(url.toString(), workExperience)
      .subscribe((res) => {
        if (res.message === 'Work experience created successfully') {
          this.profileDataService.refetchProfile.set(true);
        }
      });
  }

  updateWorkExperience(id: string, workExperience: WorkExperience) {
    const url = new URL(`api/work-experience/${id}`, environment.apiUrl);
    this.http
      .put<QueryReturn<WorkExperience>>(url.toString(), workExperience)
      .subscribe((res) => {
        this.profileDataService.refetchProfile.set(true);
      });
  }

  deleteWorkExperience(id: string) {
    const url = new URL(`api/work-experience/${id}`, environment.apiUrl);
    this.http.delete(url.toString()).subscribe((res) => {
      this.profileDataService.refetchProfile.set(true);
    });
  }
}
