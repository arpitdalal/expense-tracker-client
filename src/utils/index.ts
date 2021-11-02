import { Sheet } from "use-google-sheets/dist/types";

export type LastMonthInData = {
  lastMonthInData: string;
  lastMonthInDataIndex: number;
};

export const isNextMonthYear = (
  monthYears: string[] | null,
  selectedMonthYear: number
): boolean => {
  if (monthYears && monthYears[selectedMonthYear + 1] === undefined) {
    return false;
  }
  return true;
};

export const isPrevMonthYear = (
  monthYears: string[] | null,
  selectedMonthYear: number
): boolean => {
  if (monthYears && monthYears[selectedMonthYear - 1] === undefined) {
    return false;
  }
  return true;
};

export const roundNumber = (number: number) => {
  return Math.round((number + Number.EPSILON) * 100) / 100;
};

export const getLastMonthInData = (data: Sheet[]): LastMonthInData => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const lastMonthInData: string = data[data.length - 1].id.split("-")[0];
  const lastMonthInDataIndex: number = months.indexOf(lastMonthInData);
  return { lastMonthInData, lastMonthInDataIndex };
};

export const generateSheetName = (date: Date) =>
  `${date.toLocaleString("default", {
    month: "short",
  })}-${date.toLocaleString("default", {
    year: "2-digit",
  })}`;

export const generateAddMonthSheetName = (data: Sheet[]) => {
  const date = new Date();
  const { lastMonthInDataIndex }: LastMonthInData = getLastMonthInData(data);
  date.setMonth(lastMonthInDataIndex + 1);

  const lastYearInData: string = data[data.length - 1].id.split("-")[1];
  const year: string = date.toLocaleString("default", {
    year: "2-digit",
  });
  if (lastMonthInDataIndex !== 11 && lastYearInData !== year) {
    date.setFullYear(date.getFullYear() + 1);
  }
  return generateSheetName(date);
};
