import { useContext } from "react";
import { SwipeableDrawer, Container, Box, Typography } from "@mui/material";
import { Global } from "@emotion/react";

import DrawerForm from "../DrawerForm";
import Puller from "../Puller";
import { AppContext, ContextType } from "../../context/appContext";

const Drawer = () => {
  const { drawerOpen, toggleDrawer, expenseData } = useContext(
    AppContext
  ) as ContextType;

  let drawerBleeding = 25;
  process.env.REACT_APP_DRAWER_BLEEDING &&
    (drawerBleeding = parseInt(process.env.REACT_APP_DRAWER_BLEEDING));

  return (
    <>
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(75% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
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
          },
        }}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            visibility: "visible",
            right: 0,
            left: 0,
            height: "100%",
          }}
        >
          <Container maxWidth='xl' sx={{ height: "100%" }}>
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
          </Container>
        </Box>
      </SwipeableDrawer>
    </>
  );
};

export default Drawer;
