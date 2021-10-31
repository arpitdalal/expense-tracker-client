import { useState, useCallback, useEffect, useContext, useRef } from "react";
import { Button } from "@mui/material";

import { AppContext, AppContextType } from "../../context/appContext";

const AddMonthBtn = () => {
  const [shouldShow, setShouldShow] = useState<boolean>(true);

  const { data, handleAddMonthAction } = useContext(
    AppContext
  ) as AppContextType;

  const currentMonth = useRef(
    new Date().toLocaleString("default", {
      month: "short",
    })
  );

  const handleAddMonth = useCallback(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const sheetName = `${date.toLocaleString("default", {
      month: "short",
    })}-${date.toLocaleString("default", {
      year: "2-digit",
    })}`;
    handleAddMonthAction(sheetName);
  }, [handleAddMonthAction]);

  useEffect(() => {
    if (data && data[data.length - 1].id.includes(currentMonth.current)) {
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }
  }, [data, currentMonth, setShouldShow]);

  return (
    <>
      {shouldShow && (
        <Button onClick={handleAddMonth} variant='contained'>
          Create next month
        </Button>
      )}
    </>
  );
};

export default AddMonthBtn;
