import { Snackbar } from "@mui/material";

import { SlideTransition, useStyles } from "../Alert";

const ErrorAlert = () => {
  const classes = useStyles();

  return (
    <Snackbar
      open={true}
      autoHideDuration={60000}
      message='Something went wrong. Refresh or try again later.'
      TransitionComponent={SlideTransition}
      ContentProps={{ className: classes.error }}
      sx={{ top: 0 }}
    />
  );
};

export default ErrorAlert;
