import {
  useState,
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useLocation } from "react-router-dom";
import {
  MoreVert,
  EditRounded,
  DeleteRounded,
  AddRounded,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import { AppContext, AppContextType } from "../../context/appContext";
import {
  PresetsContext,
  PresetsContextType,
} from "../../context/presetsContext";
import { Action } from "../DrawerForm";

type Props = {
  title: string;
  expense: string;
  idx: number;
};

const ExpenseCard = ({ title, expense, idx }: Props) => {
  const [isActionsMenuOpen, setIsActionsMenuOpen] =
    useState<null | HTMLElement>(null);
  const [isAddPresetSet, setIsAddPresetSet] = useState<boolean>(false);

  const {
    toggleDrawer,
    setExpenseData,
    setExpenseIdx,
    toggleDialog,
    setAction,
  } = useContext(AppContext) as AppContextType;
  const { handlePresetsAction } = useContext(
    PresetsContext
  ) as PresetsContextType;

  useEffect(() => {
    setExpenseData({ title, expense });
    setExpenseIdx(idx);
  }, [title, expense, idx, setExpenseData, setExpenseIdx]);

  const { pathname } = useLocation();

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

  const handleAddPreset = useCallback(() => {
    setAction("create");
    setIsAddPresetSet(true);
  }, [setIsAddPresetSet, setAction]);

  useEffect(() => {
    if (isAddPresetSet) {
      handlePresetsAction({ title, expense });
      setIsAddPresetSet(false);
    }
  }, [isAddPresetSet, setIsAddPresetSet, handlePresetsAction, title, expense]);

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
              {!pathname.includes("presets") && (
                <MenuItem
                  onClick={() => {
                    handleAddPreset();
                  }}
                >
                  <AddRounded />
                  <Typography marginLeft='0.4rem' variant='body1'>
                    Add to Presets
                  </Typography>
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  handleEditClick(true, "update");
                }}
              >
                <EditRounded />
                <Typography marginLeft='0.4rem' variant='body1'>
                  Edit
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleDeleteClick(true);
                }}
              >
                <DeleteRounded color='error' />
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
