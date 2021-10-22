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
