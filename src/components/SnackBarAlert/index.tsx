import { useCallback, useContext, forwardRef } from "react";
import {
  Slide,
  SlideProps,
  Snackbar,
  Alert as MuiAlert,
  AlertProps,
} from "@mui/material";

import { AppContext, AppContextType } from "../../context/appContext";

export type Severity = "success" | "error" | "warning" | "info" | undefined;

export const SlideTransition = (props: SlideProps) => {
  return <Slide {...props} direction='right' />;
};

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const SnackBarAlert = () => {
  const {
    severity,
    message,
    setOpenAlert: setOpen,
    openAlert: open,
  } = useContext(AppContext) as AppContextType;

  const handleClose = useCallback(
    (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      setOpen(false);
    },
    [setOpen]
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      sx={{ bottom: { xs: 90, sm: 24 } }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBarAlert;
