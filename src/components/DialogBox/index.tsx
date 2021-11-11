import { useContext } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import {
  DialogBoxContext,
  DialogBoxContextType,
} from "../../context/dialogBoxContext";

type Props = {
  title?: string;
  content: string;
};

const DialogBox = ({ title, content }: Props) => {
  const { open, handleClose } = useContext(
    DialogBoxContext
  ) as DialogBoxContextType;

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      aria-describedby='dialog-box'
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <DialogContentText id='dialog-box'>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Okay</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
