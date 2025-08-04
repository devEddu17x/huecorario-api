import { Injectable } from '@nestjs/common';
import { DAYS, TIME_SLOTS } from '../constants/table-properties.constants';
import { CourseData } from '../interfaces/course-data.interface';
import * as fs from 'fs';
@Injectable()
export class SvgGeneratorService {
  slotHeight: number;
  dayWidth: number;
  labelMargin: number;
  headerHeight: number;
  width: number;
  height: number;
  constructor() {
    this.slotHeight = 60;
    this.dayWidth = 160;
    this.labelMargin = 100;
    this.headerHeight = 40;

    this.width = this.labelMargin + this.dayWidth * DAYS.length;
  }

  // Helper privates
  private findSlotIndex(timeStr: string): number | null {
    for (let i = 0; i < TIME_SLOTS.length; i++) {
      const [start, end] = TIME_SLOTS[i].split('-');
      if (timeStr >= start && timeStr < end) {
        return i;
      }
    }
    return null;
  }

  private findSlotEndIndex(timeStr: string): number | null {
    for (let i = 0; i < TIME_SLOTS.length; i++) {
      const [start, end] = TIME_SLOTS[i].split('-');
      if (timeStr >= start && timeStr <= end) {
        return i;
      }
    }
    return null;
  }

  private wrapText(text: string, maxCharsPerLine: number = 15): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;

      if (testLine.length > maxCharsPerLine && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // SVG generation privates
  private createSVGHeader(renderData: CourseData[]): string {
    const usedTimeSlots = this.getUsedTimeSlots(renderData);
    const actualHeight =
      this.headerHeight + this.slotHeight * usedTimeSlots.length;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${this.width}" height="${actualHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .header-bg { fill: #e2e8f0; stroke: #cbd5e1; stroke-width: 1; }
      .time-bg { fill: #f1f5f9; stroke: #d1d5db; stroke-width: 1; }
      .grid-cell { fill: none; stroke: #e5e7eb; stroke-width: 1; }
      .course-block { fill: #dbeafe; stroke: #60a5fa; stroke-width: 2; }
      .header-text { font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; fill: black; }
      .time-text { font-family: Arial, sans-serif; font-size: 14px; fill: black; }
      .course-text { font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #1e3a8a; }
    </style>
  </defs>`;
  }

  private createTimeHeader(): string {
    return `
  <!-- Time header -->
  <rect x="0" y="0" width="${this.labelMargin}" height="${this.headerHeight}" class="time-bg"/>
  <text x="10" y="25" class="header-text">HORA</text>`;
  }

  private createDayHeaders(): string {
    let svg = '';
    for (let i = 0; i < DAYS.length; i++) {
      const x = this.labelMargin + i * this.dayWidth;
      svg += `
  <!-- Day header: ${DAYS[i]} -->
  <rect x="${x}" y="0" width="${this.dayWidth}" height="${this.headerHeight}" class="header-bg"/>
  <text x="${x + 10}" y="25" class="header-text">${this.escapeXml(DAYS[i])}</text>`;
    }
    return svg;
  }

  private createTimeLabelsAndGrid(renderData: CourseData[]): string {
    const usedTimeSlots = this.getUsedTimeSlots(renderData);
    let svg = '';

    for (let i = 0; i < usedTimeSlots.length; i++) {
      const slotIndex = usedTimeSlots[i];
      const y = this.headerHeight + i * this.slotHeight;

      // Time label background
      svg += `
  <!-- Time slot: ${TIME_SLOTS[slotIndex]} -->
  <rect x="0" y="${y}" width="${this.labelMargin}" height="${this.slotHeight}" class="time-bg"/>
  <text x="10" y="${y + 35}" class="time-text">${TIME_SLOTS[slotIndex]}</text>`;

      // Grid cells
      for (let j = 0; j < DAYS.length; j++) {
        const x = this.labelMargin + j * this.dayWidth;
        svg += `
  <rect x="${x}" y="${y}" width="${this.dayWidth}" height="${this.slotHeight}" class="grid-cell"/>`;
      }
    }

    return svg;
  }

  private createCourseBlocks(renderData: CourseData[]): string {
    const usedTimeSlots = this.getUsedTimeSlots(renderData);
    let svg = '';

    for (const course of renderData) {
      const dayIndex = DAYS.indexOf(course.day);
      const startIndex = this.findSlotIndex(course.start);
      const endIndex = this.findSlotEndIndex(course.end);

      if (startIndex === null || endIndex === null || dayIndex === -1) {
        continue;
      }

      // Find the positions in the filtered array
      const startPosition = usedTimeSlots.indexOf(startIndex);
      const endPosition = usedTimeSlots.indexOf(endIndex);

      if (startPosition === -1 || endPosition === -1) {
        continue;
      }

      const top = this.headerHeight + startPosition * this.slotHeight;
      const bottom = this.headerHeight + (endPosition + 1) * this.slotHeight;
      const left = this.labelMargin + dayIndex * this.dayWidth;
      const blockHeight = bottom - top;

      // Course block background
      svg += `
  <!-- Course: ${course.course} -->
  <rect x="${left}" y="${top}" width="${this.dayWidth}" height="${blockHeight}" class="course-block"/>`;

      // Course text
      const lines = this.wrapText(course.course);
      const lineHeight = 18;
      const totalTextHeight = lines.length * lineHeight;
      let currentY = top + (blockHeight - totalTextHeight) / 2 + lineHeight - 5;

      for (const line of lines) {
        const textX = left + this.dayWidth / 2;
        svg += `
  <text x="${textX}" y="${currentY}" text-anchor="middle" class="course-text">${this.escapeXml(line)}</text>`;
        currentY += lineHeight;
      }
    }

    return svg;
  }

  // private to get used time slots
  private getUsedTimeSlots(renderData: CourseData[]): number[] {
    const usedSlots = new Set<number>();

    for (const course of renderData) {
      const startIndex = this.findSlotIndex(course.start);
      const endIndex = this.findSlotEndIndex(course.end);

      if (startIndex !== null && endIndex !== null) {
        for (let i = startIndex; i <= endIndex; i++) {
          usedSlots.add(i);
        }
      }
    }

    return Array.from(usedSlots).sort((a, b) => a - b);
  }

  // Main private to generate schedule
  generateScheduleSVG(
    renderData: CourseData[],
    outputPath: string = './horario.svg',
  ): string {
    const svgContent = `${this.createSVGHeader(renderData)}
${this.createTimeHeader()}
${this.createDayHeaders()}
${this.createTimeLabelsAndGrid(renderData)}
${this.createCourseBlocks(renderData)}
</svg>`;

    // Save the SVG file
    fs.writeFileSync(outputPath, svgContent, 'utf8');

    console.log(`Horario SVG generado exitosamente en: ${outputPath}`);
    return svgContent;
  }
}
