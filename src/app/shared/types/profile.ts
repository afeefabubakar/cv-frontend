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
  workExperiences: WorkExperience[];
  educations: Education[];
}

export interface WorkExperience {
  id: string;
  company: string;
  description: string[];
  jobTitle: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  location: City;
  profile: Profile;
}

export interface Education {
  id: string;
  institute: string;
  degree: string;
  cgpa: number;
  awards: string[];
  activities: string[];
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  location: City;
  profile: Profile;
}
