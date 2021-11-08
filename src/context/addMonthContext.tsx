import { useContext, createContext, useCallback } from "react";

import { AppContext, AppContextType, serverSheetUrl } from "./appContext";
import { generateAddMonthSheetName } from "../utils";

export type AddMonthContextType = {
  handleAddMonth: () => Promise<void>;
};

export const AddMonthContext = createContext({});

const AddMonthContextProvider = (
  props: React.PropsWithChildren<React.ReactNode>
) => {
  const {
    data,
    setIsFetchLoading,
    setOpenAlert,
    setMessage,
    setSeverity,
    setData,
  } = useContext(AppContext) as AppContextType;

  const handleAddMonthAction = useCallback(
    (sheetName: string) => {
      setIsFetchLoading(true);

      fetch(serverSheetUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          resSheetName: sheetName,
        }),
      })
        .then((resData) => {
          if (resData.status !== 201) throw new Error("Something went wrong");
          setOpenAlert(true);
          setMessage("Month Added");
          setSeverity("success");
          setData(
            (prevData) => prevData && [...prevData, { id: sheetName, data: [] }]
          );
        })
        .catch(() => {
          setOpenAlert(true);
          setMessage("Something went wrong");
          setSeverity("error");
        })
        .finally(() => {
          setIsFetchLoading(false);
        });
    },
    [setOpenAlert, setMessage, setSeverity, setData, setIsFetchLoading]
  );

  const handleAddMonth = useCallback(() => {
    if (!data) return;

    const sheetName = generateAddMonthSheetName(data);
    handleAddMonthAction(sheetName);
  }, [data, handleAddMonthAction]);

  return (
    <AddMonthContext.Provider value={{ handleAddMonth }} {...props}>
      {props.children}
    </AddMonthContext.Provider>
  );
};

export default AddMonthContextProvider;
