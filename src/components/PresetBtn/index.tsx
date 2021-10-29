import { useState, useCallback } from "react";
import { Button } from "@mui/material";

import { HandlePresetAction } from "../DrawerForm";

type Props = {
  handlePresetAction: HandlePresetAction;
  preset: any;
  idx: number;
};

const PresetBtn = ({ handlePresetAction, preset, idx }: Props) => {
  const [isPresetAdded, setIsPresetAdded] = useState<boolean>(false);

  const handlePresetBtnClick = useCallback(
    (action, newPreset) => {
      if (action === "add") {
        setIsPresetAdded(true);
      } else {
        setIsPresetAdded(false);
      }
      handlePresetAction(
        action,
        {
          title: newPreset.Title,
          expense: newPreset.Expense,
        },
        idx
      );
    },
    [handlePresetAction, setIsPresetAdded, idx]
  );

  return (
    <>
      {isPresetAdded ? (
        <Button
          variant='outlined'
          onClick={() => {
            handlePresetBtnClick("remove", { Title: "", Expense: "" });
          }}
          sx={{
            mx: "0.5rem",
          }}
          disabled={preset.disabled}
        >
          Remove {preset.Title} preset
        </Button>
      ) : (
        <Button
          variant='outlined'
          onClick={() => {
            handlePresetBtnClick("add", preset);
          }}
          sx={{
            mx: "0.5rem",
          }}
          disabled={preset.disabled}
        >
          Add {preset.Title} preset
        </Button>
      )}
    </>
  );
};

export default PresetBtn;
