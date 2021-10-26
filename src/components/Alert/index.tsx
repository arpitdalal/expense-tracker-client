import { useState, useEffect, useCallback, useContext } from "react";
import { IconButton, Slide, SlideProps, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";
import { AppContext, ContextType } from "../../context/appContext";

export type Severity =
  | "snack-success"
  | "snack-error"
  | "snack-warning"
  | "snack-info"
  | "";

export function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction='right' />;
}

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    success: {
      backgroundColor: `${theme.palette.success.main} !important`,
      color: `${theme.palette.success.contrastText} !important`,
    },
    info: {
      backgroundColor: `${theme.palette.info.main} !important`,
      color: `${theme.palette.info.contrastText} !important`,
    },
    error: {
      backgroundColor: `${theme.palette.error.main} !important`,
      color: `${theme.palette.error.contrastText} !important`,
    },
    warning: {
      backgroundColor: `${theme.palette.warning.main} !important`,
      color: `${theme.palette.warning.contrastText} !important`,
    },
  })
);

const Alert = () => {
  const [className, setClassName] = useState<string>("");

  const {
    severity,
    message,
    setOpenAlert: setOpen,
    openAlert: open,
  } = useContext(AppContext) as ContextType;

  const classes = useStyles();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    switch (severity) {
      case "snack-success": {
        setClassName(classes.success);
        break;
      }
      case "snack-warning": {
        setClassName(classes.warning);
        break;
      }
      case "snack-error": {
        setClassName(classes.error);
        break;
      }
      case "snack-info": {
        setClassName(classes.info);
        break;
      }
      default: {
        break;
      }
    }
  }, [severity, setClassName, classes]);

  const action = (
    <IconButton
      size='small'
      aria-label='close'
      color='inherit'
      onClick={handleClose}
    >
      <CloseIcon fontSize='small' />
    </IconButton>
  );

  return (
    <Snackbar
      open={open}
      autoHideDuration={60000}
      onClose={handleClose}
      message={message}
      action={action}
      TransitionComponent={SlideTransition}
      ContentProps={{ className: className }}
      sx={{ bottom: { xs: 90, sm: 24 } }}
    />
  );
};

export default Alert;
