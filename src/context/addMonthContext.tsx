import { useContext, createContext, useCallback } from "react";

import { AppContext, AppContextType, serverSheetUrl } from "./appContext";
import { PresetsContext, PresetsContextType } from "./presetsContext";
import { generateAddMonthSheetName } from "../utils";

export type AddMonthContextType = {
  handleAddMonth: () => Promise<void>;
};

export const AddMonthContext = createContext({});

const AddMonthContextProvider = (
  props: React.PropsWithChildren<React.ReactNode>
) => {
  const {
    data: appData,
    setIsFetchLoading,
    setOpenAlert,
    setMessage,
    setSeverity,
    handleAction,
    setData: setAppData,
  } = useContext(AppContext) as AppContextType;
  const { data: presetData } = useContext(PresetsContext) as PresetsContextType;

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
          setAppData(
            (prevData) => prevData && [...prevData, { id: sheetName, data: [] }]
          );
          presetData &&
            presetData.forEach((sheet) => {
              sheet.data.forEach((row: any) => {
                row.ShouldAddToNextMonth === "1" &&
                  handleAction(
                    { title: row.Title, expense: row.Expense },
                    "create",
                    sheetName
                  );
              });
            });
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
    [
      setOpenAlert,
      setMessage,
      setSeverity,
      setAppData,
      setIsFetchLoading,
      presetData,
      handleAction,
    ]
  );

  const handleAddMonth = useCallback(() => {
    if (!appData) return;

    const sheetName = generateAddMonthSheetName(appData);
    handleAddMonthAction(sheetName);
  }, [appData, handleAddMonthAction]);

  return (
    <AddMonthContext.Provider value={{ handleAddMonth }} {...props}>
      {props.children}
    </AddMonthContext.Provider>
  );
};

export default AddMonthContextProvider;
