import {
  Component,
  effect,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  Validators,
  ValidationErrors,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { WorkExperience } from '../../../shared/types/profile';
import { NgFor, NgIf } from '@angular/common';
import { LocationService } from '../../location/services/location.services';
import { City, Country, State } from '../../../shared/types/location';

@Component({
  selector: 'app-work-experience-form',
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './work-experience.forms.html',
  styleUrl: './work-experience.forms.css',
  providers: [LocationService],
})
export class WorkExperienceFormComponent {
  @Input() open: boolean = false;
  @Input() workExperience: WorkExperience | null = null;
  @Output() onSubmit: EventEmitter<WorkExperience> =
    new EventEmitter<WorkExperience>();
  form: FormGroup;
  invalidFields: { [key: string]: ValidationErrors } = {};
  submitted = false;
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
      company: new FormControl(Validators.required),
      jobTitle: new FormControl(Validators.required),
      location: new FormControl(Validators.required),
      state: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      country: new FormControl(
        {
          value: '',
          disabled: true,
        },
        Validators.required
      ),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      isCurrent: new FormControl(false),
      description: new FormArray(
        [new FormControl('', Validators.required)],
        Validators.required
      ),
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

    if (changes['workExperience']) {
      if (this.workExperience) {
        this.form.patchValue({
          ...this.workExperience,
          startDate: new Date(this.workExperience.startDate)
            .toISOString()
            .slice(0, 10),
          endDate: this.workExperience.endDate
            ? new Date(this.workExperience.endDate).toISOString().slice(0, 10)
            : undefined,
          location: this.workExperience.location.id,
          description: this.workExperience.description.forEach((desc, i) => {
            if (i === 0) this.description.clear();
            this.description.push(new FormControl(desc, Validators.required));
          }),
        });
      }
    }
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
    this.onSubmit.emit(this.form.value);
  }

  get description() {
    return this.form.get('description') as FormArray;
  }

  addDescription() {
    this.description.push(new FormControl('', Validators.required));
  }

  removeDescription(index: number) {
    this.description.removeAt(index);
  }
}
