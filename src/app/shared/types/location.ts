import { Profile } from './profile';

interface LocationDetails {
  id: string;
  name: string;
}

export interface City extends LocationDetails {
  state: State;
  country: Country;
  profiles: Profile[];
}

export interface State extends LocationDetails {
  countryId: string;
  country: Country;
  cities?: City[];
}

export interface Country extends LocationDetails {
  iso2: string;
  state?: State[];
  cities: City[];
}
