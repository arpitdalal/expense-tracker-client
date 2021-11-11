import { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";

import { AppContext, AppContextType } from "./context/appContext";
import CircularPageLoading from "./components/CircularPageLoading";
import DeleteDialogBox from "./components/DeleteDialogBox";
import Drawer from "./components/Drawer";
import SnackBarAlert from "./components/SnackBarAlert";
import AnimatedFab from "./components/AnimatedFab";

const App = () => {
  const { isFetchLoading, action, message, severity } = useContext(
    AppContext
  ) as AppContextType;

  const history = useHistory();

  useEffect(() => {
    history.listen(() => {
      // check for sw updates on page change
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          registrations.forEach((registration) => registration.update())
        );
    });
  }, [history]);

  return (
    <>
      {isFetchLoading && <CircularPageLoading />}
      {action === "delete" ? <DeleteDialogBox /> : <Drawer />}

      {severity && message !== "" && <SnackBarAlert />}

      <AnimatedFab />
    </>
  );
};

export default App;
