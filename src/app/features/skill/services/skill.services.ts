import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Skill } from '../../../shared/types/profile';
import { environment } from '../../../../environments/environment';
import { QueryReturn } from '../../../shared/types';
import { ProfileDataService } from '../../profile/services/profile-data.services';

@Injectable({
  providedIn: 'root',
})
export class SkillServices {
  private profileDataService = inject(ProfileDataService);
  skillsData = signal<Skill[]>([]);
  refetchSkills = signal(false);
  skills = computed(() => {
    if (this.refetchSkills()) {
      this.fetchSkills();
    }

    return this.skillsData();
  });

  constructor(private http: HttpClient) {
    this.getSkills().subscribe((skills) => {
      if (skills.data) {
        this.skillsData.set(skills.data);
      }
    });
  }

  private fetchSkills() {
    this.getSkills().subscribe((skills) => {
      if (skills.data) {
        this.skillsData.set(skills.data);
      }
      this.refetchSkills.set(false);
    });
  }

  getSkills() {
    return this.http.get<QueryReturn<Skill[]>>(environment.apiUrl + '/skill');
  }

  addSkill(skill: Skill) {
    this.http
      .post<QueryReturn<Skill>>(environment.apiUrl + '/skill', skill)
      .subscribe((res) => {
        this.profileDataService.refetchProfile.set(true);
        this.refetchSkills.set(true);
      });
  }

  addProfileSkill(skillId: string) {
    const url = new URL('api/skill/profile', environment.apiUrl);
    url.searchParams.set(
      'profileId',
      this.profileDataService.selectedProfile()
    );

    return this.http.post<QueryReturn<Skill>>(url.toString(), { skillId });
  }

  deleteSkill(id: string) {
    this.http
      .delete<QueryReturn<Skill>>(environment.apiUrl + '/skill/' + id)
      .subscribe((res) => {
        this.refetchSkills.set(true);
        this.profileDataService.refetchProfile.set(true);
      });
  }

  deleteProfileSkill(id: string) {
    this.http
      .delete<QueryReturn<Skill>>(environment.apiUrl + '/skill/profile/' + id)
      .subscribe((res) => {
        this.profileDataService.refetchProfile.set(true);
        this.refetchSkills.set(true);
      });
  }
}
