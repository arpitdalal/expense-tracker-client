import { useContext, useEffect, useState } from "react";
import { Box, Divider, Typography } from "@mui/material";

import { AppContext, AppContextType } from "../../context/appContext";
import TotalMenu from "../TotalMenu";

const Total = () => {
  const [color, setColor] = useState("");

  const { total, selectedMonthYear } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    if (total[selectedMonthYear] < 0) {
      setColor("success");
    } else if (total[selectedMonthYear] > 0) {
      setColor("error");
    } else {
      setColor("");
    }
  }, [setColor, total, selectedMonthYear]);

  return (
    <Box maxWidth='sm' marginTop='1rem' marginRight='auto'>
      <Typography variant='h4' color='primary'>
        Balance
      </Typography>
      <Divider />
      <Box display='flex' marginTop='0.5rem' alignItems='center'>
        <Typography mr='0.5rem' color={`${color}.main`}>
          {total[selectedMonthYear]} CAD
        </Typography>
        <TotalMenu />
      </Box>
    </Box>
  );
};

export default Total;
