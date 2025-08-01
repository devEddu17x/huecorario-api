import { ScheduleBasicData } from 'src/own-schedule/interfaces/basic-data.interface';

export interface LoginResponse {
  schedules: ScheduleBasicData[];
  student: {
    _id: string;
    name: string;
    currentCycle: number;
    program: string;
  };
  tokenExpiresIn: string;
}
