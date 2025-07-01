import { IEodReports } from './IeodReport';
import { IPlannTask } from './IplanTask';

export interface IWeeklyReports {
  date: string;
  plannTask:IPlannTask;
  eodReport:IEodReports
  day:string;
  status:string;
}
