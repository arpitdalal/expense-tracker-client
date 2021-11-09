import { useContext, createContext, useCallback } from "react";
import { Sheet } from "use-google-sheets/dist/types";

import {
  AppContext,
  AppContextType,
  ExpenseData,
  serverRowUrl,
} from "./appContext";
import { PresetsContext, PresetsContextType } from "./presetsContext";
import { generateAddMonthSheetName } from "../utils";
import { Action } from "../components/DrawerForm";

export type TotalActionsContextType = {
  handleCarryForwardAction: (
    customAction: Action,
    formData?: ExpenseData | undefined
  ) => void;
  handleTotalActions: (action: TotalActions, formData: ExpenseData) => void;
};
export type TotalActions = "Paid" | "Received" | "Carry forward";

export const TotalActionsContext = createContext({});

const TotalActionsContextProvider = (
  props: React.PropsWithChildren<React.ReactNode>
) => {
  const {
    data: appData,
    setIsFetchLoading,
    setOpenAlert,
    setMessage,
    setSeverity,
    handleAction,
    monthYears,
    selectedMonthYear,
    setData: setAppData,
  } = useContext(AppContext) as AppContextType;
  const { data: presetData } = useContext(PresetsContext) as PresetsContextType;

  const handleTotalActions = useCallback(
    (action: TotalActions, formData: ExpenseData) => {
      setIsFetchLoading(true);

      const sheetName = monthYears
        ? monthYears[selectedMonthYear].replace(" ", "-")
        : "";

      fetch(serverRowUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          ...formData,
          resSheetName: sheetName,
        }),
      })
        .then((resData) => {
          if (resData.status !== 201) throw new Error("Something went wrong");
          setOpenAlert(true);
          setMessage(`${action} expense added`);
          setSeverity("success");

          setAppData((prevData) => {
            if (!prevData) return null;
            const newData: Sheet[] = [...prevData];
            newData.map((sheet) => {
              if (sheet.id === sheetName) {
                sheet.data.push({
                  Title: formData.title,
                  Expense: formData.expense,
                  CreatedAt: new Date().toLocaleDateString(),
                });
              }
              return sheet;
            });
            return newData;
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
      setIsFetchLoading,
      setOpenAlert,
      setMessage,
      setSeverity,
      setAppData,
      monthYears,
      selectedMonthYear,
    ]
  );

  const handleCarryForwardAction = useCallback(
    (customAction: Action, formData?: ExpenseData) => {
      if (!formData || customAction !== "create") return;

      setIsFetchLoading(true);

      const sheetName = generateAddMonthSheetName(appData || []);
      fetch(serverRowUrl, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          ...formData,
          resSheetName: sheetName,
        }),
      })
        .then((resData) => {
          if (resData.status !== 201) throw new Error("Something went wrong");
          setOpenAlert(true);
          setMessage("Carry forward expense added");
          setSeverity("success");

          setAppData((prevData) => {
            if (!prevData) return null;
            const newData: Sheet[] = [...prevData];
            newData.push({ id: sheetName, data: [] });
            newData[newData.length - 1].data.push({
              Title: formData.title,
              Expense: formData.expense,
              CreatedAt: new Date().toLocaleDateString(),
            });
            return newData;
          });
          const expense =
            Number(formData.expense) > 0
              ? `${-Number(formData.expense)}`
              : `${-Number(formData.expense)}`;
          handleTotalActions("Carry forward", {
            title: `Carry forwarded to ${sheetName.split("-")[0]}`,
            expense,
          });
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
      setIsFetchLoading,
      handleTotalActions,
      setAppData,
      appData,
      handleAction,
      presetData,
    ]
  );

  return (
    <TotalActionsContext.Provider
      value={{ handleCarryForwardAction, handleTotalActions }}
      {...props}
    >
      {props.children}
    </TotalActionsContext.Provider>
  );
};

export default TotalActionsContextProvider;
