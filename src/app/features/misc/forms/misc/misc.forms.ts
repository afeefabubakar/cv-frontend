import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Misc } from '../../../../shared/types/profile';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-misc-form',
  imports: [ReactiveFormsModule],
  templateUrl: './misc.forms.html',
  styleUrl: './misc.forms.css',
})
export class MiscFormComponent {
  @Input() isOpen: boolean = false;
  @Output() onSubmit = new EventEmitter<Misc>();
  form: FormGroup;
  invalidFields: Record<string, ValidationErrors> = {};

  constructor() {
    this.form = new FormGroup({
      label: new FormControl('', Validators.required),
      value: new FormControl(''),
    });
  }

  submit() {
    if (this.form.invalid) {
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
