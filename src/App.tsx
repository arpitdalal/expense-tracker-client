import { useEffect, useContext } from "react";
import { Container } from "@mui/material";
import { Box } from "@mui/system";
import useGoogleSheets from "use-google-sheets";

import { AppContext, ContextType } from "./context/appContext";
import Carousel from "./components/Carousel";
import Header from "./components/Header";
import ExpenseCard from "./components/ExpenseCard";

const App = () => {
  const { selectedMonthYear, setSelectedMonthYear, monthYears, setMonthYears } =
    useContext(AppContext) as ContextType;

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY as string;
  const sheetId = process.env.REACT_APP_GOOGLE_SHEETS_ID as string;
  const { data, loading, error } = useGoogleSheets({
    apiKey,
    sheetId,
  });

  useEffect(() => {
    const dataMonthYears = data.map((dataMonthYear) => dataMonthYear.id);
    setMonthYears(dataMonthYears);
    setSelectedMonthYear(dataMonthYears.length - 1);
  }, [data, setMonthYears, setSelectedMonthYear]);

  return (
    <Container maxWidth='xl'>
      <Header />

      {loading && "Skeleton"}
      {error && "Error"}
      {data && !loading && !error && (
        <>
          <Carousel>{monthYears && monthYears[selectedMonthYear]}</Carousel>

          <Box marginTop='2rem'>
            {data[selectedMonthYear].data.map((dataExpense: any, idx) => (
              <ExpenseCard
                title={dataExpense.Title}
                expense={dataExpense.Expense}
                key={dataExpense.Title}
                idx={idx}
              />
            ))}
          </Box>
        </>
      )}
    </Container>
  );
};

export default App;
