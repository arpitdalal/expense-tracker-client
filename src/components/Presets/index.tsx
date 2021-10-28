import { useContext, useState, useEffect } from "react";
import { Box } from "@mui/system";

import {
  AppContext,
  AppContextType,
  ExpenseData,
} from "../../context/appContext";
import {
  PresetsContext,
  PresetsContextType,
} from "../../context/presetsContext";
import PresetBtn from "../PresetBtn";

type Props = {
  handlePresetAction: ({ title, expense }: ExpenseData) => void;
};

const Presets = ({ handlePresetAction }: Props) => {
  const [shouldShow, setShouldShow] = useState<boolean>(false);

  const { data, loading, error } = useContext(
    PresetsContext
  ) as PresetsContextType;
  const { expenseData } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    expenseData.title === "" &&
      expenseData.expense === "" &&
      setShouldShow(true);
    // eslint-disable-next-line
  }, []);

  return (
    <Box display='flex' flexDirection='row' flexWrap='wrap' marginTop='1rem'>
      {!loading &&
        !error &&
        shouldShow &&
        data &&
        data[0].data.map((preset: any, idx) => (
          <PresetBtn
            handlePresetAction={handlePresetAction}
            key={`${preset.Title}-${idx}`}
            preset={preset}
          />
        ))}
    </Box>
  );
};

export default Presets;
