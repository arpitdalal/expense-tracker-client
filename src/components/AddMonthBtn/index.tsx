import { useContext } from "react";
import { Button } from "@mui/material";

import {
  AddMonthContext,
  AddMonthContextType,
} from "../../context/addMonthContext";

const AddMonthBtn = () => {
  const { handleAddMonth } = useContext(AddMonthContext) as AddMonthContextType;

  return (
    <Button onClick={handleAddMonth} variant='contained'>
      Create next month
    </Button>
  );
};

export default AddMonthBtn;
