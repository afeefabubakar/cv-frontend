import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { DialogComponent } from '../../../shared/components/dialog/dialog.components';
import { ProfileDataService } from '../../profile/services/profile-data.services';
import { Profile, Skill } from '../../../shared/types/profile';
import { SkillForm } from './skill.forms';
import { SkillServices } from '../services/skill.services';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  selector: 'app-profile-skill-form',
  imports: [SkillForm, DialogComponent, ReactiveFormsModule, SvgIconComponent],
  templateUrl: './profile-skill.forms.html',
  styleUrls: ['./profile-skill.forms.css'],
})
export class ProfileSkillForm {
  @Output() onSubmit = new EventEmitter<Skill>();
  private skillService = inject(SkillServices);
  private profileService = inject(ProfileDataService);
  isOpen: boolean = false;
  selectedProfile: string = '';
  profileSkillForm: FormGroup;
  skills: Skill[] = [];
  profileSkills: Profile['ProfileSkill'] = [];
  invalidFields: { [key: string]: ValidationErrors } = {};

  constructor() {
    effect(() => {
      this.selectedProfile = this.profileService.selectedProfile();
      this.skills = this.skillService.skills();
      this.profileSkills = this.profileService.profile()?.ProfileSkill || [];
    });

    this.profileSkillForm = new FormGroup({
      id: new FormControl('', Validators.required),
    });
  }

  submit() {
    if (!this.profileSkillForm.valid) {
      this.invalidFields = Object.keys(this.profileSkillForm.controls).reduce(
        (acc, key) => {
          const control = this.profileSkillForm.get(key);
          if (control?.errors) {
            acc[key] = control.errors;
          }
          return acc;
        },
        {} as { [key: string]: ValidationErrors }
      );
      return;
    }
    this.onSubmit.emit(this.profileSkillForm.value);
    this.profileSkillForm.reset();
  }

  addSkill(skill: Skill) {
    this.skillService.addSkill(skill);
    this.closeDialog();
  }

  deleteSkill() {
    this.skillService.deleteSkill(this.profileSkillForm.value.id);
    this.profileSkillForm.reset();
  }

  deleteProfileSkill(skillId: string) {
    this.skillService.deleteProfileSkill(skillId);
  }

  openDialog() {
    this.isOpen = true;
  }

  closeDialog() {
    this.isOpen = false;
    this.profileSkillForm.reset();
  }
}
