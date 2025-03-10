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
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
  location: City;
  workExperiences: WorkExperience[];
  educations: Education[];
  ProfileSkill: {
    id: string;
    skill: Skill;
  }[];
  misc: Misc[];
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

export interface Skill {
  id: string;
  skill: string;
  category: string;
}

export interface Misc {
  id: string;
  item: Record<string, string>;
  profileId: string;
}