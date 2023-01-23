import QueryString from 'qs';

export type ResidentEntity = {
  id: number;
  name: string;
  isActive: boolean;
};

export type Resident = Omit<ResidentEntity, 'id' | 'isActive'>;

export type ResidentsQueries = {
  name: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
  id: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
  isActive: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
};
