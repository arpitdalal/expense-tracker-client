import { useContext, useEffect } from "react";
import { Fab, Zoom } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { AppContext, ContextType } from "../../context/appContext";

const AnimatedFab = () => {
  const { toggleDrawer, setExpenseData, selectedMonthYear } = useContext(
    AppContext
  ) as ContextType;

  useEffect(() => {
    setExpenseData({ title: "", expense: "" });
  }, [setExpenseData, selectedMonthYear]);

  return (
    <Zoom in={true} style={{ transitionDelay: "1000ms" }}>
      <Fab
        color='secondary'
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
        onClick={() => {
          toggleDrawer(true, "create");
        }}
      >
        <AddIcon />
      </Fab>
    </Zoom>
  );
};

export default AnimatedFab;
