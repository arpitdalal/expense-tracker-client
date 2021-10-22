import { useContext, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  Typography,
} from "@mui/material";
import { AppContext, ContextType } from "../../context/appContext";

const DialogBox = () => {
  const { toggleDialog, handleAction, openDialog } = useContext(
    AppContext
  ) as ContextType;

  const handleDialogClose = useCallback(() => {
    toggleDialog(false);
  }, [toggleDialog]);

  const handleDialogYesClick = useCallback(() => {
    handleAction();
    toggleDialog(false);
  }, [handleAction, toggleDialog]);

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
