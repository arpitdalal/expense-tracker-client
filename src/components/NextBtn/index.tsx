import { useContext, useState, useEffect } from "react";
import { ChevronRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import { AppContext, ContextType } from "../../context/appContext";

const NextBtn = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { selectedMonthYear, setNextMonthYear, monthYears } = useContext(
    AppContext
  ) as ContextType;

  useEffect(() => {
    if (monthYears && monthYears[selectedMonthYear + 1] === undefined) {
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
