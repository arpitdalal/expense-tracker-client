import { useContext, useState, useEffect } from "react";
import { Box } from "@mui/system";

import { AppContext, AppContextType } from "../../context/appContext";
import {
  PresetsContext,
  PresetsContextType,
} from "../../context/presetsContext";
import PresetBtn from "../PresetBtn";
import { HandlePresetAction } from "../DrawerForm";

type Props = {
  handlePresetAction: HandlePresetAction;
};

const Presets = ({ handlePresetAction }: Props) => {
  const [shouldShow, setShouldShow] = useState<boolean>(false);

  const { data, loading, error } = useContext(
    PresetsContext
  ) as PresetsContextType;
  const { expenseData } = useContext(AppContext) as AppContextType;

  const shouldShowBool = expenseData.title === "" && expenseData.expense === "";

  useEffect(() => {
    shouldShowBool && setShouldShow(true);
  }, [shouldShowBool]);

  return (
    <Box
      display='flex'
      flexDirection='row'
      flexWrap='wrap'
      gap='0.5rem'
      marginTop='1rem'
      justifyContent='center'
    >
      {!loading &&
        !error &&
        shouldShow &&
        data &&
        data[0].data.map((preset: any, idx: number) => (
          <PresetBtn
            handlePresetAction={handlePresetAction}
            key={`${preset.Title}-${idx}`}
            preset={preset}
            idx={idx}
          />
        ))}
    </Box>
  );
};

export default Presets;
