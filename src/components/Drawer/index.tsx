import { useContext } from "react";
import { SwipeableDrawer, Box } from "@mui/material";

import DrawerForm from "../DrawerForm";
import Puller from "../Puller";
import { AppContext, AppContextType } from "../../context/appContext";

const Drawer = () => {
  const { drawerOpen, toggleDrawer } = useContext(AppContext) as AppContextType;

  return (
    <SwipeableDrawer
      anchor={"bottom"}
      open={drawerOpen}
      onClose={() => {
        toggleDrawer(false);
      }}
      onOpen={() => {
        toggleDrawer(true);
      }}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          pb: "2rem",
          pt: "3rem",
        },
      }}
    >
      <Puller />
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        height='100%'
      >
        <DrawerForm />
      </Box>
    </SwipeableDrawer>
  );
};

export default Drawer;
