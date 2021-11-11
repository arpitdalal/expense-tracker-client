import { useEffect, useContext, useState } from "react";
import { Box } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

import { AppContext, AppContextType } from "../../context/appContext";
import { roundNumber } from "../../utils";
import AnimatedSkeleton from "../../components/Skeleton";
import ErrorAlert from "../../components/ErrorAlert";
import Carousel from "../../components/Carousel";
import ExpenseCard from "../../components/ExpenseCard";
import Total from "../../components/Total";
import AddMonthBtn from "../../components/AddMonthBtn";

export const useStyles = makeStyles(() =>
  createStyles({
    flexWrapper: {
      display: "grid",
      gap: "1rem",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gridAutoRows: "minmax(100px, auto)",
    },
  })
);

const Home = () => {
  const [shouldAddNextBtnShow, setShouldAddNextBtnShow] =
    useState<boolean>(false);

  const {
    selectedMonthYear,
    setSelectedMonthYear,
    monthYears,
    setMonthYears,
    data,
    loading,
    error,
    setTotal,
    swiperHandlers,
    total,
  } = useContext(AppContext) as AppContextType;

  const classes = useStyles();

  useEffect(() => {
    if (!data) return;
    const dataMonthYears = data.map((sheet) => sheet.id.replace("-", " "));
    const arrayOfArrayOfNumbers = data.map((sheet) =>
      sheet.data.map((row: any) => parseFloat(row.Expense))
    );
    const arrayOfTotal = arrayOfArrayOfNumbers.map((row) =>
      row.reduce((a, b) => roundNumber(a + b), 0)
    );

    setTotal(arrayOfTotal);
    setMonthYears(dataMonthYears);
    setSelectedMonthYear(dataMonthYears.length - 1);
  }, [data, setMonthYears, setSelectedMonthYear, setTotal]);
  useEffect(() => {
    if (!data || data.length <= 0) return;
    const currentMonth = new Date().toLocaleString("en-us", {
      month: "short",
    });
    const lastMonth = data[data.length - 1].id.split("-")[0];
    if (currentMonth === lastMonth) {
      const currentDate = new Date().getDate();
      if (currentDate > 23 && total[data.length - 1] === 0) {
        setShouldAddNextBtnShow(true);
      }
    } else {
      setShouldAddNextBtnShow(false);
    }
  }, [data, setShouldAddNextBtnShow, total]);

  return (
    <Box component='div' {...swiperHandlers}>
      {loading && <AnimatedSkeleton type='Expenses' />}
      {error && <ErrorAlert />}
      {data && !loading && !error && (
        <>
          <Carousel>{monthYears && monthYears[selectedMonthYear]}</Carousel>
          {shouldAddNextBtnShow && (
            <Box textAlign='right' mt='1rem'>
              <AddMonthBtn />
            </Box>
          )}
          <Total />
          <Box>
            <Box marginTop='2rem' className={classes.flexWrapper}>
              {data[selectedMonthYear].data.map((dataExpense: any, idx) => (
                <Box key={`${dataExpense.Title}-${idx}`}>
                  <ExpenseCard
                    title={dataExpense.Title}
                    expense={dataExpense.Expense}
                    idx={idx}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Home;
