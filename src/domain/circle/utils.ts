import { AttendingDay } from './types';

export function attendingDaysToString(attendingDays: AttendingDay[]): string {
  return `Day ${getDayAmount(attendingDays)}`;
}

function getDayAmount(attendingDays: AttendingDay[]): string {
  if (attendingDays.includes('SAT') && attendingDays.includes('SUN')) {
    return '1 & 2';
  }

  return attendingDays.includes('SAT') ? '1' : '2';
}

export function attendingDaysToDays(attendingDays: AttendingDay[]): string[] {
  const days: string[] = [];

  if (attendingDays.includes('SAT')) {
    days.push('saturday');
  }

  if (attendingDays.includes('SUN')) {
    days.push('sunday');
  }

  return days;
}
