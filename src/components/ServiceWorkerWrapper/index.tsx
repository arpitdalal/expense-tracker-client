import { useState, useEffect } from "react";
import { Snackbar, Button } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";

import * as serviceWorkerRegistration from "../../serviceWorkerRegistration";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    update: {
      backgroundColor: `${theme.palette.primary.main} !important`,
      color: `${theme.palette.primary.contrastText} !important`,
    },
  })
);

const ServiceWorkerWrapper = () => {
  const [showReload, setShowReload] = useState(true);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(
    null
  );

  const classes = useStyles();

  const onSWUpdate = (registration: ServiceWorkerRegistration) => {
    setShowReload(true);
    setWaitingWorker(registration.waiting);
  };

  useEffect(() => {
    serviceWorkerRegistration.register({ onUpdate: onSWUpdate });
  }, []);

  const reloadPage = () => {
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
    setShowReload(false);
    window.location.reload();
  };

  return (
    <Snackbar
      open={showReload}
      message='A new version is available!'
      onClick={reloadPage}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      action={
        <Button color='inherit' size='small' onClick={reloadPage}>
          Reload
        </Button>
      }
      ContentProps={{ className: classes.update }}
    />
  );
};

export default ServiceWorkerWrapper;
