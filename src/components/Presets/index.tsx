import { useContext, useState, useEffect } from "react";
import { Button } from "@mui/material";

import {
  AppContext,
  AppContextType,
  ExpenseData,
} from "../../context/appContext";
import {
  PresetsContext,
  PresetsContextType,
} from "../../context/presetsContext";
import { FormData } from "../DrawerForm";
import { Box } from "@mui/system";

type Props = {
  handleAddPreset: ({ title, expense }: ExpenseData) => void;
  formData: FormData;
};

const Presets = ({ handleAddPreset, formData }: Props) => {
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const { data, loading, error } = useContext(
    PresetsContext
  ) as PresetsContextType;
  const { expenseData } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    expenseData.title === "" &&
      expenseData.expense === "" &&
      setShouldShow(true);
  }, []);

  return (
    <Box marginTop='1rem'>
      {!loading &&
        !error &&
        shouldShow &&
        data &&
        data[0].data.map((preset: any, idx) => (
          <Button
            key={`${preset.Title}-${idx}`}
            variant='outlined'
            onClick={() => {
              handleAddPreset({
                title: preset.Title,
                expense: preset.Expense,
              });
            }}
          >
            Add {preset.Title} preset
          </Button>
        ))}
    </Box>
  );
};

export default Presets;
