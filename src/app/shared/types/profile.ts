import { City } from './location';

export interface ProfileListItem {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
  location: City;
}
