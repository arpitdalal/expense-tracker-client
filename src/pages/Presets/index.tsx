import { useContext } from "react";
import { Box } from "@mui/material";

import {
  PresetsContextType,
  PresetsContext,
} from "../../context/presetsContext";
import { useStyles } from "../Home";
import AnimatedSkeleton from "../../components/Skeleton";
import ErrorAlert from "../../components/ErrorAlert";
import ExpenseCard from "../../components/ExpenseCard";

const Presets = () => {
  const { data, loading, error } = useContext(
    PresetsContext
  ) as PresetsContextType;

  const classes = useStyles();

  return (
    <>
      {loading && <AnimatedSkeleton type='Presets' />}
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
