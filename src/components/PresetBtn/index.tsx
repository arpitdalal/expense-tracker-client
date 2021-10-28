import { useState, useCallback } from "react";
import { Button } from "@mui/material";

import { ExpenseData } from "../../context/appContext";

type Props = {
  handlePresetAction: ({ title, expense }: ExpenseData) => void;
  preset: any;
};

const PresetBtn = ({ handlePresetAction, preset }: Props) => {
  const [isPresetAdded, setIsPresetAdded] = useState<boolean>(false);

  const handleAddPresetBtnClick = useCallback(
    (preset) => {
      setIsPresetAdded(true);
      handlePresetAction({
        title: preset.Title,
        expense: preset.Expense,
      });
    },
    [handlePresetAction, setIsPresetAdded]
  );

  const handleRemovePresetBtnClick = useCallback(() => {
    setIsPresetAdded(false);
    handlePresetAction({
      title: "",
      expense: "",
    });
  }, [setIsPresetAdded, handlePresetAction]);

  return (
    <>
      {isPresetAdded ? (
        <Button
          variant='outlined'
          onClick={() => {
            handleRemovePresetBtnClick();
          }}
          sx={{
            mx: "0.5rem",
          }}
        >
          Remove {preset.Title} preset
        </Button>
      ) : (
        <Button
          variant='outlined'
          onClick={() => {
            handleAddPresetBtnClick(preset);
          }}
          sx={{
            mx: "0.5rem",
          }}
        >
          Add {preset.Title} preset
        </Button>
      )}
    </>
  );
};

export default PresetBtn;
