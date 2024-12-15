import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { ProfileDataService } from '../services/profile-data.services';
import { Profile } from '../../../shared/types/profile';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { LocationService } from '../../location/services/location.services';
import { City, Country, State } from '../../../shared/types/location';

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.forms.html',
  styleUrl: './profile.forms.css',
})
export class ProfileFormComponent {
  @Output() onSubmit = new EventEmitter<Profile>();
  private profileService = inject(ProfileDataService);
  private locationService = inject(LocationService);
  profile: Profile | undefined;
  form: FormGroup;
  invalidFields: { [key: string]: ValidationErrors } = {};
  listOfLocations: { cities: City[]; states: State[]; countries: Country[] } = {
    cities: [],
    states: [],
    countries: [],
  };

  constructor() {
    effect(() => {
      this.profile = this.profileService.profile();
      this.listOfLocations = this.locationService.listOfLocations();
      if (this.profile) {
        this.form.patchValue({
          firstName: this.profile.firstName,
          lastName: this.profile.lastName,
          jobTitle: this.profile.jobTitle,
          location: this.profile.location.id,
          state: this.profile.location.state.id,
          country: this.profile.location.country.id,
          email: this.profile.email,
          phone: this.profile.phone,
          summary: this.profile.summary,
        });
      } else {
        this.form.reset();
      }

      this.form.get('location')?.valueChanges.subscribe((location) => {
        const selectedCity = this.listOfLocations.cities.find(
          (c) => c.id === location
        );
        this.form.get('state')?.setValue(selectedCity?.stateId);
        this.form.get('country')?.setValue(selectedCity?.countryId);
      });
    });

    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      jobTitle: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      state: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      country: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      summary: new FormControl('', [Validators.required]),
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
  }
}
