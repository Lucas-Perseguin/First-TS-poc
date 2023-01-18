import QueryString from 'qs';

export type HouseworkEntity = {
  id: number;
  name: string;
  description: string;
  date: Date;
  responsible: number;
  done: boolean;
  completion: Date | null;
};

export type HouseworkEdit = Omit<HouseworkEntity, 'id' | 'done' | 'completion'>;

export type Housework = Omit<HouseworkEdit, 'responsible'>;

export type Queries = {
  id?: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
  name?: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
  date?: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
  done?: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[];
  responsible?:
    | string
    | string[]
    | QueryString.ParsedQs
    | QueryString.ParsedQs[];
};
