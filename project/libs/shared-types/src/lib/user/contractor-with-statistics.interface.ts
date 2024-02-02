import { Contractor } from './contractor.interface';

export type ContractorWithStatistics = Omit<Contractor, 'cityId'> & {
  city: string;
  doneTaskCount: number;
  failedTaskCount: number;
  rating: number;
  ratingLevel: number;
};
