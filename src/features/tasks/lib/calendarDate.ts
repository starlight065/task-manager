import type { CalendarMonth, DateParts } from "../types/calendar";

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseIsoDate(value: string): DateParts | null {
  const match = ISO_DATE_PATTERN.exec(value);

  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  const day = Number.parseInt(match[3], 10);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return { year, month, day };
}

export function toIsoDate(parts: DateParts): string {
  return `${parts.year.toString().padStart(4, "0")}-${parts.month
    .toString()
    .padStart(2, "0")}-${parts.day.toString().padStart(2, "0")}`;
}

export function getTodayParts(now = new Date()): DateParts {
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

export function getTodayIsoDate(now = new Date()): string {
  return toIsoDate(getTodayParts(now));
}

export function getCalendarMonth(parts: Pick<DateParts, "year" | "month">): CalendarMonth {
  return {
    year: parts.year,
    month: parts.month,
  };
}

export function isSameCalendarMonth(left: CalendarMonth, right: CalendarMonth): boolean {
  return left.year === right.year && left.month === right.month;
}

export function addMonths(month: CalendarMonth, delta: number): CalendarMonth {
  const nextDate = new Date(month.year, month.month - 1 + delta, 1);

  return {
    year: nextDate.getFullYear(),
    month: nextDate.getMonth() + 1,
  };
}

export function getDaysInMonth(month: CalendarMonth): number {
  return new Date(month.year, month.month, 0).getDate();
}

export function getMonthLabel(month: CalendarMonth, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(month.year, month.month - 1, 1));
}

export function formatIsoDate(
  value: string,
  options: Intl.DateTimeFormatOptions,
  locale = "en-US",
): string {
  const parts = parseIsoDate(value);

  if (!parts) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, options).format(
    new Date(parts.year, parts.month - 1, parts.day),
  );
}

export function getWeekdayLabels(locale = "en-US"): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const firstSunday = new Date(2023, 0, 1);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(firstSunday);

    date.setDate(firstSunday.getDate() + index);

    return formatter.format(date);
  });
}

export function getMonthGrid(month: CalendarMonth): DateParts[] {
  const firstDayOfMonth = new Date(month.year, month.month - 1, 1);
  const leadingDays = firstDayOfMonth.getDay();
  const days: DateParts[] = [];

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(month.year, month.month - 1, 1 - leadingDays + index);

    days.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });
  }

  return days;
}

export function getFirstSelectableDate(
  month: CalendarMonth,
  dueDates: string[],
): string {
  const firstDueDate = dueDates
    .filter((value) => {
      const parts = parseIsoDate(value);

      return (
        parts !== null && parts.year === month.year && parts.month === month.month
      );
    })
    .sort((left, right) => left.localeCompare(right))[0];

  if (firstDueDate) {
    return firstDueDate;
  }

  return toIsoDate({
    year: month.year,
    month: month.month,
    day: 1,
  });
}
