import { useContext } from "react";

import {
  PresetsContextType,
  PresetsContext,
} from "../../context/presetsContext";
import AnimatedSkeleton from "../../components/Skeleton";
import ErrorAlert from "../../components/ErrorAlert";
import { Box } from "@mui/system";

import { useStyles } from "../Home";
import ExpenseCard from "../../components/ExpenseCard";

const Presets = () => {
  const { data, loading, error } = useContext(
    PresetsContext
  ) as PresetsContextType;

  const classes = useStyles();

  return (
    <>
      {loading && <AnimatedSkeleton />}
      {error && <ErrorAlert />}
      {data && !loading && !error && (
        <Box>
          <Box marginTop='2rem' className={classes.flexWrapper}>
            {data[0].data.map((expense: any, idx) => (
              <Box key={`${expense.Title}-${idx}`}>
                <ExpenseCard
                  title={expense.Title}
                  expense={expense.Expense}
                  idx={idx}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Presets;