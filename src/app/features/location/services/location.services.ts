import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { QueryReturn } from '../../../shared/types';
import { environment } from '../../../../environments/environment';
import { City, State, Country } from '../../../shared/types/location';

@Injectable({ providedIn: 'root' })
export class LocationService {
  listOfLocations = signal<{
    cities: City[];
    states: State[];
    countries: Country[];
  }>({ cities: [], states: [], countries: [] });

  constructor(private http: HttpClient) {
    this.getAllLocations().subscribe((res) => {
      if (res.data) {
        this.listOfLocations.set(res.data);
      }
    });
  }

  getAllLocations() {
    return this.http.get<
      QueryReturn<{ cities: City[]; states: State[]; countries: Country[] }>
    >(environment.apiUrl + '/location');
  }
}
