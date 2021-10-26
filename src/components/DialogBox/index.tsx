import { useContext, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { AppContext, AppContextType } from "../../context/appContext";
import {
  PresetsContext,
  PresetsContextType,
} from "../../context/presetsContext";

const DialogBox = () => {
  const { toggleDialog, handleAction, openDialog } = useContext(
    AppContext
  ) as AppContextType;
  const { handlePresetsAction } = useContext(
    PresetsContext
  ) as PresetsContextType;

  const { pathname } = useLocation();

  const handleDialogClose = useCallback(() => {
    toggleDialog(false);
  }, [toggleDialog]);

  const handleDialogYesClick = useCallback(() => {
    pathname.includes("presets") ? handlePresetsAction() : handleAction();
    toggleDialog(false);
  }, [handleAction, handlePresetsAction, toggleDialog, pathname]);

  return (
    <Dialog
      open={openDialog}
      onClose={handleDialogClose}
      aria-labelledby='responsive-dialog-title'
    >
      <DialogTitle id='responsive-dialog-title'>
        Are you sure you want to{" "}
        <Typography component='span' color='error'>
          delete
        </Typography>{" "}
        this expense?
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleDialogClose} autoFocus>
          No
        </Button>
        <Button onClick={handleDialogYesClick}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
