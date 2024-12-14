import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { EducationServices } from '../services/education.services';
import { NgIf } from '@angular/common';
import { Country } from '../../../shared/types/location';
import { State } from '../../../shared/types/location';
import { City } from '../../../shared/types/location';
import { LocationService } from '../../location/services/location.services';
import { Education } from '../../../shared/types/profile';

@Component({
  selector: 'app-education-form',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './education.forms.html',
  styleUrl: './education.forms.css',
  providers: [LocationService],
})
export class EducationFormComponent {
  @Input() open: boolean = false;
  @Input() education: Education | null = null;
  @Output() onSubmit = new EventEmitter<Education>();
  form: FormGroup;
  submitted = false;
  invalidFields: { [key: string]: ValidationErrors } = {};
  listOfLocations: { cities: City[]; states: State[]; countries: Country[] } = {
    cities: [],
    states: [],
    countries: [],
  };

  constructor(private locationService: LocationService) {
    effect(() => {
      this.listOfLocations = this.locationService.listOfLocations();
    });

    this.form = new FormGroup({
      institute: new FormControl('', [Validators.required]),
      degree: new FormControl('', [Validators.required]),
      cgpa: new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(4),
      ]),
      awards: new FormArray([]),
      activities: new FormArray([]),
      location: new FormControl('', [Validators.required]),
      state: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      country: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      isCurrent: new FormControl(false),
    });

    this.form.get('location')?.valueChanges.subscribe((location) => {
      const selectedCity = this.listOfLocations.cities.find(
        (c) => c.id === location
      );
      this.form.get('state')?.setValue(selectedCity?.stateId);
      this.form.get('country')?.setValue(selectedCity?.countryId);
    });

    this.form.get('isCurrent')?.valueChanges.subscribe((isCurrent) => {
      const endDateControl = this.form.get('endDate');
      if (isCurrent) {
        endDateControl?.disable();
        endDateControl?.setValue(null);
      } else {
        endDateControl?.enable();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['open'].currentValue) {
      this.form.reset();
      this.invalidFields = {};
      this.submitted = false;
    }

    if (changes['education']) {
      if (this.education) {
        this.form.patchValue({
          ...this.education,
          startDate: new Date(this.education.startDate)
            .toISOString()
            .slice(0, 10),
          endDate: this.education.endDate
            ? new Date(this.education.endDate).toISOString().slice(0, 10)
            : undefined,
          location: this.education.location.id,
          awards: this.education.awards.forEach((award, i) => {
            if (i === 0) this.awards.clear();
            this.awards.push(new FormControl(award, Validators.required));
          }),
          activities: this.education.activities.forEach((activity, i) => {
            if (i === 0) this.activities.clear();
            this.activities.push(
              new FormControl(activity, Validators.required)
            );
          }),
        });
      }
    }
  }

  get awards() {
    return this.form.get('awards') as FormArray;
  }

  addAward() {
    this.awards.push(new FormControl('', [Validators.required]));
  }

  removeAward(index: number) {
    this.awards.removeAt(index);
  }

  get activities() {
    return this.form.get('activities') as FormArray;
  }

  addActivity() {
    this.activities.push(new FormControl('', [Validators.required]));
  }

  removeActivity(index: number) {
    this.activities.removeAt(index);
  }

  submit() {
    this.submitted = true;
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
    const newData = {
      ...this.form.value,
      isCurrent: Boolean(this.form.value.isCurrent),
      startDate: new Date(this.form.value.startDate),
      endDate: this.form.value.endDate
        ? new Date(this.form.value.endDate)
        : undefined,
    };
    this.onSubmit.emit(newData);
  }
}
