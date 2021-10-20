import { useState, MouseEvent } from "react";
import { MoreVert, Edit, Delete } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

// import { AppContext, ContextType } from "../../context/appContext";
import Puller from "../Puller";
import DrawerForm from "../DrawerForm";

type Props = {
  title: string;
  expense: string;
  idx: number;
};

const ExpenseCard = ({ title, expense, idx }: Props) => {
  const [isActionsMenuOpen, setIsActionsMenuOpen] =
    useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  // const [selectedExpense, setSelectedExpense] = useState<string>("");

  // const { selectedMonthYear, monthYears } = useContext(
  //   AppContext
  // ) as ContextType;

  const open = Boolean(isActionsMenuOpen);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setIsActionsMenuOpen(event.currentTarget);
  };

  const handleClose = () => {
    setIsActionsMenuOpen(null);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setDrawerOpen(newOpen);
  };

  const deleteClick = () => {
    console.log("Delete Clicked");
  };

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
                <MenuItem onClick={toggleDrawer(true)}>
                  <Edit />
                  <Typography marginLeft='0.4rem' variant='body1'>
                    Edit
                  </Typography>
                </MenuItem>
                <MenuItem onClick={deleteClick}>
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
              action='update'
            />
          </Box>
        </Container>
      </SwipeableDrawer>
    </>
  );
};

export default ExpenseCard;
