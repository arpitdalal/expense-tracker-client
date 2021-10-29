import { useContext } from "react";
import { SwipeableDrawer, Box, Typography } from "@mui/material";

import DrawerForm from "../DrawerForm";
import Puller from "../Puller";
import { AppContext, AppContextType } from "../../context/appContext";

const Drawer = () => {
  const { drawerOpen, toggleDrawer, expenseData } = useContext(
    AppContext
  ) as AppContextType;

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
        <Typography variant='h4' textAlign='center'>
          {expenseData.title}
        </Typography>
        <DrawerForm />
      </Box>
    </SwipeableDrawer>
  );
};

export default Drawer;
