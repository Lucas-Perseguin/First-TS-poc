export type ResidentEntity = {
  id: number;
  name: string;
  isActive: boolean;
};

export type Resident = Omit<ResidentEntity, 'id' | 'isActive'>;
