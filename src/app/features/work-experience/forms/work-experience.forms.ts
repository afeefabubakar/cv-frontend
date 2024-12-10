import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { WorkExperience } from '../../../shared/types/profile';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-work-experience-form',
  imports: [FormsModule, NgIf],
  templateUrl: './work-experience.forms.html',
  styleUrl: './work-experience.forms.css',
})
export class WorkExperienceFormComponent {
  @Input() open: boolean = false;
  @Output() onSubmit: EventEmitter<WorkExperience> =
    new EventEmitter<WorkExperience>();
  constructor() {
    this.form = new FormGroup({
      company: new FormControl('', Validators.required),
      jobTitle: new FormControl('', Validators.required),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['open']) {
      this.form.reset();
      this.invalidFields = {};
    }
  }

  submit() {
    if (!this.form.valid) {
      this.invalidFields = Object.keys(this.form.controls).reduce(
        (acc, key) => {
          const control = this.form.get(key);
          console.log(key, control);
          if (control?.errors) {
            acc[key] = control.errors;
          }
          return acc;
        },
        {} as { [key: string]: ValidationErrors }
      );
      console.log(this.invalidFields);
      return;
    }
    this.onSubmit.emit(this.form.value);
  }

  form: FormGroup;
  invalidFields: { [key: string]: ValidationErrors } = {};
}
