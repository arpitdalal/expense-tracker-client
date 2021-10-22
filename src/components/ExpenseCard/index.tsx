import {
  useState,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { MoreVert, Edit, Delete } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import { AppContext, ContextType } from "../../context/appContext";
import { Action } from "../DrawerForm";

type Props = {
  title: string;
  expense: string;
  idx: number;
};

const ExpenseCard = ({ title, expense, idx }: Props) => {
  const [isActionsMenuOpen, setIsActionsMenuOpen] =
    useState<null | HTMLElement>(null);

  const { toggleDrawer, setExpenseData, setExpenseIdx, toggleDialog } =
    useContext(AppContext) as ContextType;

  useEffect(() => {
    setExpenseData({ title, expense });
    setExpenseIdx(idx);
  }, [title, expense, idx, setExpenseData, setExpenseIdx]);

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

  const handleEditClick = useCallback(
    (newOpen: boolean, action?: Action) => {
      setExpenseData({ title, expense });
      setExpenseIdx(idx);
      toggleDrawer(newOpen, action);
    },
    [toggleDrawer, expense, title, setExpenseData, setExpenseIdx, idx]
  );

  const handleDeleteClick = useCallback(
    (newOpen: boolean) => {
      setExpenseIdx(idx);
      toggleDialog(newOpen);
    },
    [toggleDialog, setExpenseIdx, idx]
  );

  return (
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
              aria-controls={`${idx}-actions-menu`}
              aria-expanded={open ? "true" : "false"}
              aria-haspopup='true'
              onClick={handleClick}
              sx={{ color: "text.secondary" }}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id={`${idx}-actions-menu`}
              anchorEl={isActionsMenuOpen}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleEditClick(true, "update");
                }}
              >
                <Edit />
                <Typography marginLeft='0.4rem' variant='body1'>
                  Edit
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleDeleteClick(true);
                }}
              >
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
  );
};

export default ExpenseCard;
