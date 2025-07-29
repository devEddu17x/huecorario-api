import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule } from './schemas/schedule.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<Schedule>,
  ) {}

  async findByCoursesIdGrouped(coursesId: string[]) {
    // Convertir strings a ObjectIds si es necesario
    const objectIds = coursesId.map((id) => new mongoose.Types.ObjectId(id));

    // Buscar todos los schedules de los cursos especificados
    const schedules = await this.scheduleModel
      .find({
        course: { $in: objectIds },
      })
      .populate({
        path: 'blocks.teacher',
        select: 'id name', // opcional: seleccionar solo los campos que necesites
      })
      .exec();

    // Agrupar schedules por course ID
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

  // Alternativa usando agregación de MongoDB (más eficiente)
  async findByCoursesIdGroupedWithAggregation(coursesId: string[]) {
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
        $group: {
          _id: '$course',
          schedules: { $push: '$$ROOT' },
        },
      },
    ]);

    // Convertir el resultado a un objeto con keys como strings
    const groupedSchedules: Record<string, any[]> = {};
    result.forEach((group) => {
      groupedSchedules[group._id.toString()] = group.schedules;
    });

    return groupedSchedules;
  }
}
