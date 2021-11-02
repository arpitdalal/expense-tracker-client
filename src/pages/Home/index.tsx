import { useEffect, useContext } from "react";
import { Box } from "@mui/material";
// import { Box } from "@mui/system";
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

  return (
    <>
      {loading && <AnimatedSkeleton />}
      {error && <ErrorAlert />}
      {data && !loading && !error && (
        <>
          <Carousel>{monthYears && monthYears[selectedMonthYear]}</Carousel>
          <Box textAlign='right' mt='1rem'>
            <AddMonthBtn />
          </Box>
          <Box {...swiperHandlers}>
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
            <Total />
          </Box>
        </>
      )}
    </>
  );
};

export default Home;
