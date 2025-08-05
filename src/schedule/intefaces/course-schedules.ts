import { ScheduleDocument } from '../schemas/schedule.schema';

export interface CourseSchedules {
  courseName: string;
  schedules: ScheduleDocument[];
}
