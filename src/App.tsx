import { useContext } from "react";

import { AppContext, AppContextType } from "./context/appContext";
import CircularPageLoading from "./components/CircularPageLoading";
import DialogBox from "./components/DialogBox";
import Drawer from "./components/Drawer";
import Alert from "./components/Alert";
import AnimatedFab from "./components/AnimatedFab";

const App = () => {
  const { isFetchLoading, action, message, severity } = useContext(
    AppContext
  ) as AppContextType;

  return (
    <>
      {isFetchLoading && <CircularPageLoading />}
      {action === "delete" ? <DialogBox /> : <Drawer />}

      {severity !== "" && message !== "" && <Alert />}

      <AnimatedFab />
    </>
  );
};

export default App;
