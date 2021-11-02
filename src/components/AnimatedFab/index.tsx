import { useContext, useEffect, useState, useCallback } from "react";
import { Fab, Zoom } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import { AppContext, AppContextType } from "../../context/appContext";

const AnimatedFab = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [scrollHeight, setScrollHeight] = useState<number>(
    document.body.scrollTop || document.documentElement.scrollTop
  );
  const { toggleDrawer, setExpenseData, selectedMonthYear } = useContext(
    AppContext
  ) as AppContextType;

  const listenToScroll = useCallback(() => {
    let heightToHideFrom = 100;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    if (winScroll < scrollHeight) {
      setIsVisible(true);
    } else {
      if (winScroll > heightToHideFrom) {
        isVisible && // to limit setting state only the first time
          setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    }
    setScrollHeight(winScroll);
  }, [isVisible, setIsVisible, scrollHeight, setScrollHeight]);

  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, [listenToScroll]);

  useEffect(() => {
    setExpenseData({ title: "", expense: "" });
  }, [setExpenseData, selectedMonthYear]);

  return (
    <Zoom
      in={isVisible}
      timeout={transitionDuration}
      style={{
        transitionDelay: `${isVisible ? transitionDuration.exit : 0}ms`,
      }}
      unmountOnExit
    >
      <Fab
        color='primary'
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(2),
          right: (theme) => theme.spacing(2),
        }}
        aria-label='add'
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
