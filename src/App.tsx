import { useEffect, useContext } from "react";
import { Container, Collapse } from "@mui/material";
import { Box } from "@mui/system";
import { TransitionGroup } from "react-transition-group";

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
  } = useContext(AppContext) as ContextType;

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

            <Box marginTop='2rem'>
              <TransitionGroup>
                {data[selectedMonthYear].data.map((dataExpense: any, idx) => (
                  <Collapse in={true} key={`${dataExpense.Title}-${idx}`}>
                    <Box>
                      <ExpenseCard
                        title={dataExpense.Title}
                        expense={dataExpense.Expense}
                        idx={idx}
                      />
                    </Box>
                  </Collapse>
                ))}
              </TransitionGroup>
            </Box>
            <Total />
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
