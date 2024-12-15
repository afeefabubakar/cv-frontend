import { Component, effect, inject, signal } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog/dialog.components';
import { Profile, Skill } from '../../../shared/types/profile';
import { ProfileDataService } from '../../profile/services/profile-data.services';
import { ProfileSkillForm } from '../forms/profile-skill.forms';
import { SkillServices } from '../services/skill.services';

@Component({
  selector: 'app-profile-skill',
  imports: [ProfileSkillForm, DialogComponent],
  templateUrl: './profile-skill.views.html',
  styleUrls: ['./profile-skill.views.css'],
})
export class ProfileSkillViews {
  private profileService = inject(ProfileDataService);
  private skillService = inject(SkillServices);
  selectedProfile: string = '';
  profile = signal<Profile | null>(null);
  isOpen: boolean = false;
  isLocked = false;

  constructor() {
    effect(() => {
      this.isLocked = this.profileService.isLocked();
      this.selectedProfile = this.profileService.selectedProfile();
      const profile = this.profileService.profile();
      if (profile) {
        this.profile.set(profile);
      }
    });
  }

  get skillGroupedByCategory() {
    const profile = this.profile();
    if (!profile) return [];

    const skillsGroup = new Map<string, string[]>();
    profile.ProfileSkill.forEach((skill) => {
      const skillCategory = skill.skill.category;
      skillsGroup.set(skillCategory, [
        ...(skillsGroup.get(skillCategory) || []),
        skill.skill.skill,
      ]);
    });
    return skillsGroup;
  }

  openDialog() {
    this.isOpen = true;
  }

  closeDialog() {
    this.isOpen = false;
  }

  onSubmit(skill: Skill) {
    this.skillService.addProfileSkill(skill.id).subscribe((res) => {
      this.profileService.refetchProfile.set(true);
    });
    this.closeDialog();
  }
}
