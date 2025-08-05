import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule } from './schemas/schedule.schema';
import mongoose, { Model } from 'mongoose';
import { CourseSchedules } from './intefaces/course-schedules';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
  ) {}

  async findByCoursesIdGrouped(coursesId: string[]) {
    const objectIds = coursesId.map((id) => new mongoose.Types.ObjectId(id));

    const schedules = await this.scheduleModel
      .find({
        course: { $in: objectIds },
      })
      .populate({
        path: 'blocks.teacher',
        select: 'id name',
      })
      .exec();

    const groupedSchedules: Record<string, any[]> = {};

    schedules.forEach((schedule) => {
      const courseId = schedule.course.toString();

      if (!groupedSchedules[courseId]) {
        groupedSchedules[courseId] = [];
      }

      groupedSchedules[courseId].push(schedule);
    });

    return groupedSchedules;
  }

  async findByCoursesIdGroupedWithAggregation(
    coursesId: string[],
  ): Promise<CourseSchedules[]> {
    const objectIds = coursesId.map((id) => new mongoose.Types.ObjectId(id));

    const result = await this.scheduleModel.aggregate([
      {
        $match: {
          course: { $in: objectIds },
        },
      },
      {
        $lookup: {
          from: 'teachers',
          localField: 'blocks.teacher',
          foreignField: '_id',
          as: 'teacherDetails',
        },
      },
      {
        $addFields: {
          blocks: {
            $map: {
              input: '$blocks',
              as: 'block',
              in: {
                $mergeObjects: [
                  '$$block',
                  {
                    teacher: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$teacherDetails',
                            cond: { $eq: ['$$this._id', '$$block.teacher'] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $unset: 'teacherDetails',
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseDetails',
        },
      },
      {
        $group: {
          _id: '$course',
          schedules: { $push: '$$ROOT' },
          courseInfo: { $first: { $arrayElemAt: ['$courseDetails', 0] } },
        },
      },
      {
        $project: {
          _id: 0, // Eliminar _id del grupo
          courseName: '$courseInfo.name',
          schedules: {
            $map: {
              input: '$schedules',
              as: 'schedule',
              in: {
                _id: { $toString: '$$schedule._id' },
                nrc: '$$schedule.nrc',
                section: '$$schedule.section',
                idLeague: '$$schedule.idLeague',
                league: '$$schedule.league',
                credits: '$$schedule.credits',
                h: '$$schedule.h',
                ht: '$$schedule.ht',
                pp: '$$schedule.pp',
                capacity: '$$schedule.capacity',
                course: { $toString: '$$schedule.course' },
                blocks: '$$schedule.blocks',
                __v: '$$schedule.__v',
                createdAt: '$$schedule.createdAt',
                updatedAt: '$$schedule.updatedAt',
              },
            },
          },
        },
      },
    ]);

    return result;
  }
}
