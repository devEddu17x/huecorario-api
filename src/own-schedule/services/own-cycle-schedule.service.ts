import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OwnSchedule } from '../schemas/own-schedule.schema';
import { Model } from 'mongoose';
import { CreateOwnScheduleDTO } from '../dtos/create-own-schema.dto';
import { ScheduleBasicData } from '../interfaces/basic-data.interface';
import { SvgGeneratorService } from './svg-generator.service';
import { StorageService } from 'src/storage/storage.service';
import { ConfigService } from '@nestjs/config';
import { SignatureService } from 'src/signature/signature.service';
import { UpdateOwnScheduleDTO } from '../dtos/update-own-schedule.dto';
import { ScheduleService } from 'src/schedule/schedule.service';
import { CourseSchedules } from 'src/schedule/intefaces/course-schedules';

@Injectable()
export class OwnScheduleService {
  url: string;
  constructor(
    @InjectModel(OwnSchedule.name) private ownScheduleModel: Model<OwnSchedule>,
    private readonly svgGeneratorService: SvgGeneratorService,
    private readonly storageService: StorageService,
    private readonly signatureService: SignatureService,
    private readonly configService: ConfigService,
    private readonly scheduleService: ScheduleService,
  ) {
    this.url = this.configService.get<string>('cloudflare.url');
    if (!this.url) {
      throw new Error('Cloudflare URL is not defined in the configuration');
    }
  }

  async create(
    createDTO: CreateOwnScheduleDTO,
    studentId: string,
  ): Promise<any> {
    try {
      const ownSchedule = new this.ownScheduleModel({
        ...createDTO,
        student_id: studentId,
      });
      const svg: string = this.svgGeneratorService.generateScheduleSVG(
        createDTO.renderData,
      );
      ownSchedule.previewImageUrl = `${this.url}schedules/${ownSchedule._id}.svg`;

      const [_, insertedResponse] = await Promise.all([
        this.storageService.uploadFile<string>(
          `schedules/${ownSchedule._id}.svg`,
          svg,
        ),
        this.ownScheduleModel.insertOne(ownSchedule),
      ]);

      if (!insertedResponse._id) {
        throw new BadRequestException(`Failed to create own schedule`);
      }
      return { _id: insertedResponse._id };
    } catch (error) {
      throw new BadRequestException(`Error creating own schedule`);
    }
  }

  async update(
    id: string,
    studentId: string,
    updateDTO: UpdateOwnScheduleDTO,
  ): Promise<OwnSchedule | null> {
    const ownSchedule = await this.ownScheduleModel.findById(id);
    if (!ownSchedule) {
      throw new NotFoundException(`Own schedule with id ${id} not found`);
    }

    if (ownSchedule.student_id.toString() !== studentId) {
      throw new BadRequestException(
        `You do not have permission to update this schedule`,
      );
    }

    Object.assign(ownSchedule, updateDTO);
    const svg: string = this.svgGeneratorService.generateScheduleSVG(
      updateDTO.renderData,
    );
    ownSchedule.isNew = false;
    await Promise.all([
      ownSchedule.save(),
      this.storageService.uploadFile<string>(
        `schedules/${ownSchedule._id}.svg`,
        svg,
      ),
    ]);

    return ownSchedule;
  }

  async getById(
    id: string,
  ): Promise<{ ownSchedule: OwnSchedule; allSchedules: CourseSchedules[] }> {
    try {
      const ownSchedule = await this.ownScheduleModel
        .findById(id)
        .populate({
          path: 'courseSelections.schedules',
          populate: {
            path: 'blocks.teacher',
            select: 'id name',
          },
        })
        .exec();

      if (!ownSchedule) {
        throw new NotFoundException(`Own schedule with id ${id} not found`);
      }

      const courses: string[] = ownSchedule.courseSelections.map(
        (selection) => {
          return selection.course.toString();
        },
      );

      const allSchedules: CourseSchedules[] =
        await this.scheduleService.findByCoursesIdGroupedWithAggregation(
          courses,
        );

      return { ownSchedule, allSchedules };
    } catch (error) {
      throw new BadRequestException(
        `Error fetching own schedule with id ${id}`,
      );
    }
  }

  async getBasicByUserIdAndCycle(
    studentId: string,
    cycle: number,
  ): Promise<ScheduleBasicData[]> {
    try {
      const basicData = await this.ownScheduleModel
        .find({ student_id: studentId, cycle })
        .select('_id name previewImageUrl updatedAt')
        .lean();
      return basicData.map((schedule) => ({
        _id: schedule._id.toString(),
        name: schedule.name,
        previewImageUrl: this.signatureService.generateSignedURL(
          schedule.previewImageUrl,
          3600,
        ),
        updatedAt: (schedule as any).updatedAt,
      }));
    } catch (error) {
      throw new BadRequestException(`Error fetching own schedules`);
    }
  }
}
