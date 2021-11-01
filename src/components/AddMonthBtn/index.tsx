import { useCallback, useContext } from "react";
import { Button } from "@mui/material";

import { AppContext, AppContextType } from "../../context/appContext";

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

const AddMonthBtn = () => {
  const { data, handleAddMonthAction } = useContext(
    AppContext
  ) as AppContextType;

  const handleAddMonth = useCallback(() => {
    if (!data) return;
    const date = new Date();
    const lastMonthInData: string = data[data.length - 1].id.split("-")[0];
    const monthIndex: number = months.indexOf(lastMonthInData);
    date.setMonth(monthIndex + 1);

    const lastYearInData: string = data[data.length - 1].id.split("-")[1];
    const year: string = date.toLocaleString("default", {
      year: "2-digit",
    });
    if (monthIndex !== 11 && lastYearInData !== year) {
      date.setFullYear(date.getFullYear() + 1);
      console.log(date.getFullYear());
    }

    const sheetName = `${date.toLocaleString("default", {
      month: "short",
    })}-${date.toLocaleString("default", {
      year: "2-digit",
    })}`;
    handleAddMonthAction(sheetName);
  }, [handleAddMonthAction, data]);

  return (
    <Button onClick={handleAddMonth} variant='contained'>
      Create next month
    </Button>
  );
};

export default AddMonthBtn;
