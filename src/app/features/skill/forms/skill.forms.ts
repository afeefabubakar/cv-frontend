import {
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Skill } from '../../../shared/types/profile';

@Component({
  selector: 'app-skill-form',
  imports: [ReactiveFormsModule],
  templateUrl: './skill.forms.html',
  styleUrls: ['./skill.forms.css'],
})
export class SkillForm {
  @Output() onSubmit = new EventEmitter<Skill>();
  form: FormGroup;
  invalidFields: { [key: string]: ValidationErrors } = {};

  constructor() {
    this.form = new FormGroup({
      category: new FormControl('', Validators.required),
      skill: new FormControl('', Validators.required),
    });
  }

  submit() {
    if (!this.form.valid) {
      this.invalidFields = Object.keys(this.form.controls).reduce(
        (acc, key) => {
          const control = this.form.get(key);
          if (control?.errors) {
            acc[key] = control.errors;
          }
          return acc;
        },
        {} as { [key: string]: ValidationErrors }
      );
      return;
    }

    this.onSubmit.emit(this.form.value);
    this.form.reset();
  }
}
