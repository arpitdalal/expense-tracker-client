import { useCallback, useState, useContext, useEffect } from "react";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import {
  AddRounded,
  CallMadeRounded,
  CallReceivedRounded,
  MoreVert,
} from "@mui/icons-material";

import { AppContext, AppContextType } from "../../context/appContext";
import {
  TotalMenuContext,
  TotalMenuContextType,
} from "../../context/totalMenuContext";

const TotalMenu = () => {
  const [isActionsMenuOpen, setIsActionsMenuOpen] =
    useState<null | HTMLElement>(null);
  const [balance, setBalance] = useState<number>(0);

  const { total, selectedMonthYear } = useContext(AppContext) as AppContextType;
  const {
    shouldShow,
    handleCarryForwardClick,
    handlePaidClick,
    handleReceivedClick,
  } = useContext(TotalMenuContext) as TotalMenuContextType;

  const open = Boolean(isActionsMenuOpen);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setIsActionsMenuOpen(event.currentTarget);
    },
    [setIsActionsMenuOpen]
  );

  const handleClose = useCallback(() => {
    setIsActionsMenuOpen(null);
  }, [setIsActionsMenuOpen]);

  useEffect(() => {
    setBalance(total[selectedMonthYear]);
  }, [total, selectedMonthYear, setBalance]);

  return (
    <>
      {shouldShow && balance !== 0 && (
        <>
          <IconButton
            aria-label='more'
            id='actions-button'
            aria-controls={`total-actions-menu`}
            aria-expanded={open ? "true" : "false"}
            aria-haspopup='true'
            onClick={handleClick}
            sx={{ color: "text.secondary" }}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id={`total-actions-menu`}
            anchorEl={isActionsMenuOpen}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
          >
            {balance > 0 ? (
              <MenuItem onClick={handlePaidClick}>
                <CallMadeRounded />
                <Typography marginLeft='0.4rem'>Paid</Typography>
              </MenuItem>
            ) : (
              <MenuItem onClick={handleReceivedClick}>
                <CallReceivedRounded />
                <Typography marginLeft='0.4rem'>Received</Typography>
              </MenuItem>
            )}
            <MenuItem onClick={handleCarryForwardClick}>
              <AddRounded />
              <Typography marginLeft='0.4rem'>Carry forward</Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};

export default TotalMenu;
