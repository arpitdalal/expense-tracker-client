import { createContext, useState } from "react";

export type ContextType = {
  selectedMonthYear: number;
  setSelectedMonthYear: React.Dispatch<React.SetStateAction<number>>;
  monthYears: string[] | null;
  setMonthYears: React.Dispatch<React.SetStateAction<string[] | null>>;
  setNextMonthYear: () => void;
  setPrevMonthYear: () => void;
};

export const AppContext = createContext<ContextType | null>(null);

const AppContextProvider = (
  props: React.PropsWithChildren<React.ReactNode>
) => {
  const [selectedMonthYear, setSelectedMonthYear] = useState<number>(0);
  const [monthYears, setMonthYears] = useState<string[] | null>(null);

  const setNextMonthYear = () => {
    setSelectedMonthYear(selectedMonthYear + 1);
  };

  const setPrevMonthYear = () => {
    setSelectedMonthYear(selectedMonthYear - 1);
  };

  return (
    <AppContext.Provider
      value={{
        monthYears,
        setMonthYears,
        selectedMonthYear,
        setSelectedMonthYear,
        setNextMonthYear,
        setPrevMonthYear,
      }}
      {...props}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
