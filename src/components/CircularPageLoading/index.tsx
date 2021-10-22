import { CircularProgress, useMediaQuery, Backdrop } from "@mui/material";
import { createTheme } from "@mui/system";

const CircularPageLoading = () => {
  const theme = createTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
      <CircularProgress size={isMobile ? 75 : 100} />
    </Backdrop>
  );
};

export default CircularPageLoading;
