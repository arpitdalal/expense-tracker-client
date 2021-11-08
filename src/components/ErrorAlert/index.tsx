import { Snackbar } from "@mui/material";

import { SlideTransition } from "../SnackBarAlert";

const ErrorAlert = () => {
  return (
    <Snackbar
      open={true}
      autoHideDuration={6000}
      message='Something went wrong. Refresh or try again later.'
      TransitionComponent={SlideTransition}
      sx={{ top: 0 }}
    />
  );
};

export default ErrorAlert;
