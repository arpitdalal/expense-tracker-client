import { useContext, useCallback } from "react";
import { Grid, Typography } from "@mui/material";
import { useSwipeable } from "react-swipeable";

import { AppContext, ContextType } from "../../context/appContext";
import NextBtn from "../NextBtn";
import PrevBtn from "../PrevBtn";
import { isNextMonthYear, isPrevMonthYear } from "../../utils";

type Props = {
  children: React.ReactNode;
};

const Carousel = ({ children }: Props) => {
  const { setPrevMonthYear, setNextMonthYear, monthYears, selectedMonthYear } =
    useContext(AppContext) as ContextType;

  const swipePrevMontYear = useCallback(() => {
    isPrevMonthYear(monthYears, selectedMonthYear) === true &&
      setPrevMonthYear();
  }, [monthYears, selectedMonthYear, setPrevMonthYear]);

  const swipeNextMontYear = useCallback(() => {
    isNextMonthYear(monthYears, selectedMonthYear) === true &&
      setNextMonthYear();
  }, [monthYears, selectedMonthYear, setNextMonthYear]);

  const handlers = useSwipeable({
    onSwipedLeft: swipeNextMontYear,
    onSwipedRight: swipePrevMontYear,
  });

  return (
    <Grid
      container
      justifyContent='space-between'
      sx={{ mt: "2rem" }}
      color='text.secondary'
    >
      <Grid item textAlign='left'>
        <PrevBtn />
      </Grid>
      <Grid item textAlign='center' flexGrow={1} {...handlers}>
        <Typography variant='h6' component='div'>
          {children}
        </Typography>
      </Grid>
      <Grid item textAlign='right'>
        <NextBtn />
      </Grid>
    </Grid>
  );
};

export default Carousel;
