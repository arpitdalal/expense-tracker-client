import { useEffect, useContext } from "react";
import { Container } from "@mui/material";
import { Box } from "@mui/system";
import { createStyles, makeStyles } from "@mui/styles";

import { AppContext, ContextType } from "./context/appContext";
import Carousel from "./components/Carousel";
import Header from "./components/Header";
import ExpenseCard from "./components/ExpenseCard";
import Drawer from "./components/Drawer";
import AnimatedFab from "./components/AnimatedFab";
import DialogBox from "./components/DialogBox";
import Alert from "./components/Alert";
import CircularPageLoading from "./components/CircularPageLoading";
import Total from "./components/Total";
import AnimatedSkeleton from "./components/Skeleton";
import ErrorAlert from "./components/ErrorAlert";
import { roundNumber } from "./utils";

const useStyles = makeStyles(() =>
  createStyles({
    flexWrapper: {
      display: "grid",
      gap: "1rem",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gridAutoRows: "minmax(100px, auto)",
    },
  })
);

const App = () => {
  const {
    selectedMonthYear,
    setSelectedMonthYear,
    monthYears,
    setMonthYears,
    data,
    loading,
    error,
    action,
    severity,
    message,
    isFetchLoading,
    setTotal,
    swiperHandlers,
  } = useContext(AppContext) as ContextType;

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
      {isFetchLoading && <CircularPageLoading />}
      <Container maxWidth='xl'>
        <Header />

        {loading && <AnimatedSkeleton />}
        {error && <ErrorAlert />}
        {data && !loading && !error && (
          <>
            <Carousel>{monthYears && monthYears[selectedMonthYear]}</Carousel>
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
            {action === "delete" ? <DialogBox /> : <Drawer />}

            {severity !== "" && message !== "" && <Alert />}

            <AnimatedFab />
          </>
        )}
      </Container>
    </>
  );
};

export default App;
