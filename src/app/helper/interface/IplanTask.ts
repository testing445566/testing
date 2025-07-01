export interface IPlannTask {
  updatedAt: Date | string;
  createdAt: Date | string;
  date: string;
  editCount: number;
  id?: string;
  tasks: string[];
  userId: string;
}
