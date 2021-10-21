import { useContext, useState, useEffect } from "react";
import { ChevronRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import { AppContext, ContextType } from "../../context/appContext";
import { isNextMonthYear } from "../../utils";

const NextBtn = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { selectedMonthYear, setNextMonthYear, monthYears } = useContext(
    AppContext
  ) as ContextType;

  useEffect(() => {
    if (!isNextMonthYear(monthYears, selectedMonthYear)) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [selectedMonthYear, monthYears]);

  return (
    <IconButton
      sx={{ color: "text.secondary" }}
      disabled={isDisabled}
      onClick={setNextMonthYear}
    >
      <ChevronRight />
    </IconButton>
  );
};

export default NextBtn;
