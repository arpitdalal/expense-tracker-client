import React, {
  MouseEvent,
  SyntheticEvent,
  useState,
  useEffect,
  useCallback,
} from "react";
import { IconButton, Slide, SlideProps, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";

export type Severity =
  | "snack-success"
  | "snack-error"
  | "snack-warning"
  | "snack-info"
  | "";

type Props = {
  severity: Severity;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
};

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction='right' />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    success: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
    },
    info: {
      backgroundColor: theme.palette.info.main,
      color: theme.palette.info.contrastText,
    },
    error: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
    warning: {
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.warning.contrastText,
    },
  })
);

const Alert = ({ severity, open, setOpen, message }: Props) => {
  const [className, setClassName] = useState<string>("");

  const classes = useStyles();

  const handleClose = useCallback(
    (event: SyntheticEvent | MouseEvent) => {
      setOpen(false);
    },
    [setOpen]
  );

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
    <>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={handleClose}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </>
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
    />
  );
};

export default Alert;
