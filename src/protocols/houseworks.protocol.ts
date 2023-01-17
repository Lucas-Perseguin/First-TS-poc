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
