import { useContext } from "react";
import { Box, Divider, Typography } from "@mui/material";

import { AppContext, AppContextType } from "../../context/appContext";

const Total = () => {
  const { total, selectedMonthYear } = useContext(AppContext) as AppContextType;

  return (
    <Box maxWidth='sm' marginTop='1rem' marginRight='auto'>
      <Divider textAlign='left'>Total</Divider>
      <Typography marginTop='0.5rem' mr='0.5rem'>
        {total[selectedMonthYear]} CAD
      </Typography>
    </Box>
  );
};

export default Total;
