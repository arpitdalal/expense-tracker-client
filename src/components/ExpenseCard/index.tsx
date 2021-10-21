import { useState, MouseEvent, useCallback } from "react";
import { MoreVert, Edit, Delete } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Container,
  Fab,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Typography,
  Zoom,
} from "@mui/material";
import { Box } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";

import Puller from "../Puller";
import DrawerForm, { Action } from "../DrawerForm";

type Props = {
  title: string;
  expense: string;
  idx: number;
};

const ExpenseCard = ({ title, expense, idx }: Props) => {
  const [isActionsMenuOpen, setIsActionsMenuOpen] =
    useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [action, setAction] = useState<Action>("");

  const open = Boolean(isActionsMenuOpen);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      setIsActionsMenuOpen(event.currentTarget);
    },
    [setIsActionsMenuOpen]
  );

  const handleClose = useCallback(() => {
    setIsActionsMenuOpen(null);
  }, [setIsActionsMenuOpen]);

  const toggleDrawer = useCallback(
    (newOpen: boolean, action?: Action) => () => {
      setDrawerOpen(newOpen);
      action && setAction(action);
    },
    [setDrawerOpen]
  );

  return (
    <>
      <Card sx={{ mb: "1rem" }}>
        <CardContent>
          <Grid container justifyContent='space-between'>
            <Grid item>
              <Typography variant='h5' component='div'>
                {title}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {expense} CAD
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                aria-label='more'
                id='actions-button'
                aria-controls='actions-menu'
                aria-expanded={open ? "true" : "false"}
                aria-haspopup='true'
                onClick={handleClick}
                sx={{ color: "text.secondary" }}
              >
                <MoreVert />
              </IconButton>
              <Menu
                id='actions-menu'
                anchorEl={isActionsMenuOpen}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
              >
                <MenuItem onClick={toggleDrawer(true, "update")}>
                  <Edit />
                  <Typography marginLeft='0.4rem' variant='body1'>
                    Edit
                  </Typography>
                </MenuItem>
                <MenuItem onClick={toggleDrawer(true, "delete")}>
                  <Delete color='error' />
                  <Typography marginLeft='0.4rem' color='error'>
                    Delete
                  </Typography>
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <SwipeableDrawer
        anchor={"bottom"}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          },
        }}
      >
        <Container maxWidth='xl'>
          <Puller />
          <Box paddingTop='2rem' paddingBottom='2rem'>
            <Typography variant='h4' textAlign='center'>
              {title}
            </Typography>
            <DrawerForm
              title={title}
              idx={idx}
              expense={expense}
              action={action}
            />
          </Box>
        </Container>
      </SwipeableDrawer>

      <Zoom in={true} style={{ transitionDelay: "1000ms" }}>
        <Fab
          color='secondary'
          sx={{
            position: "fixed",
            bottom: (theme) => theme.spacing(2),
            right: (theme) => theme.spacing(2),
          }}
          onClick={toggleDrawer(true, "create")}
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </>
  );
};

export default ExpenseCard;
