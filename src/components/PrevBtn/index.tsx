import { useContext, useState, useEffect } from "react";
import { ChevronLeft } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import { AppContext, ContextType } from "../../context/appContext";
import { isPrevMonthYear } from "../../utils";

const PrevBtn = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { selectedMonthYear, setPrevMonthYear, monthYears } = useContext(
    AppContext
  ) as ContextType;

  useEffect(() => {
    if (!isPrevMonthYear(monthYears, selectedMonthYear)) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [selectedMonthYear, monthYears]);

  return (
    <IconButton
      sx={{ color: "text.secondary" }}
      disabled={isDisabled}
      onClick={setPrevMonthYear}
    >
      <ChevronLeft />
    </IconButton>
  );
};

export default PrevBtn;
