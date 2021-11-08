import { useState, useContext, useCallback, useEffect } from "react";
import { FormControlLabel, Switch as MuiSwitch } from "@mui/material";

import {
  PresetsContext,
  PresetsContextType,
} from "../../context/presetsContext";
import {
  AppContext,
  AppContextType,
  ExpenseData,
} from "../../context/appContext";

type DataObject = {
  disabled: boolean;
  ShouldAddToNextMonth: string;
};

const Switch = () => {
  const [selectedExpense, setSelectedExpense] = useState<
    ExpenseData & DataObject
  >();

  const { data, isSwitchSelected, setIsSwitchSelected } = useContext(
    PresetsContext
  ) as PresetsContextType;
  const { expenseIdx } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    if (!data) return;
    setSelectedExpense(
      data.map((sheet) => sheet.data[expenseIdx] as DataObject & ExpenseData)[0]
    );
  }, [expenseIdx, data, setSelectedExpense]);

  useEffect(() => {
    if (!selectedExpense) return;
    selectedExpense.ShouldAddToNextMonth === "1"
      ? setIsSwitchSelected(true)
      : setIsSwitchSelected(false);
  }, [selectedExpense, setIsSwitchSelected]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsSwitchSelected(event.target.checked);
    },
    [setIsSwitchSelected]
  );

  return (
    <FormControlLabel
      control={<MuiSwitch checked={isSwitchSelected} onChange={handleChange} />}
      label='Add to new month creations?'
    />
  );
};

export default Switch;
